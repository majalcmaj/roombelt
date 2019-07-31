import { action } from "utils/redux";
import cancellationToken from "utils/cancellation-token";
import screenfull from "screenfull";
import axios from "axios";
import ms from "ms";

import * as api from "services/api";
import { createDevice, getDeviceDetails, removeDevice } from "services/api";

import {
  calendarNameSelector,
  currentActionSelector,
  currentMeetingSelector,
  isCalendarSelectedSelector,
  isDashboardDeviceSelector,
  isDeviceRemovedSelector,
  isInitializedSelector,
  isInOfflineModeSelector,
  isSubscriptionCancelledSelector,
  lastActivityOnShowCalendarsViewSelector,
  minutesLeftForCheckInSelector,
  showAllCalendarsViewSelector
} from "./selectors";
import { changeLanguage } from "i18n";

import i18next from "i18next";
import { wait, waitUntilTrue } from "utils/time";

import { $updateClock } from "./state/timestamp/timestamp.duck";
import { $startClock } from "./state/timestamp/timestamp.thunks";

import { $updateDeviceData } from "./state/device/device.duck";

import {
  $setActionSource,
  $startAction,
  $setActionIsRetrying,
  $setActionError,
  $setActionSuccess,
  endAction
} from "./state/currentMeetingActions/currentMeetingActions.duck";

import {
  $markInitialized,
  $markRemoved,
  $setIsSubscriptionCancelled,
  $updateOfflineStatus,
  $updateShowAllCalendarsView,
  $allCalendarsViewActivity
} from "./state/appState/appState.duck";

export const deviceActions = {
  $markInitialized,
  initialize: () => async (dispatch, getState) => {
    if (isInitializedSelector(getState())) {
      return;
    }

    dispatch(deviceActions.$initializeApiVersionObserver());
    dispatch(deviceActions.$markInitialized());

    try {
      await getDeviceDetails();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        await createDevice();
      }
    }

    dispatch(deviceActions.$startClock());
    dispatch(deviceActions.$fetchDeviceData());
    dispatch(deviceActions.$initializeFullScreenSupport());
    dispatch(deviceActions.$initializeOfflineObserver());
  },

  $updateDeviceData,
  $fetchDeviceData: () => async (dispatch, getState) => {
    const token = cancellationToken(deviceActions.$fetchDeviceData).cancelOthers();

    try {
      const shouldGetAllCalendars = showAllCalendarsViewSelector(getState());
      const device = await getDeviceDetails(shouldGetAllCalendars);

      if (device.version && device.version !== window.version) {
        window.location.reload();
      }

      if (token.isCancelled()) {
        return;
      }

      dispatch(deviceActions.$updateDeviceData(device));
      dispatch(deviceActions.$setIsSubscriptionCancelled(false));
      dispatch(deviceActions.setLanguage(device.language));
      dispatch(deviceActions.$removeCurrentMeetingIfNotCheckedIn());
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch(deviceActions.$markRemoved());
      }
      if (error.response && error.response.status === 402) {
        dispatch(deviceActions.$setIsSubscriptionCancelled(true));
      }
    }

    const timeout = (function() {
      const state = getState();

      if (isDeviceRemovedSelector(state)) return ms("1 year");
      if (isSubscriptionCancelledSelector(state)) return ms("10 min");
      if (isDashboardDeviceSelector(state) || isCalendarSelectedSelector(state)) return ms("30s");

      return ms("5s");
    })();

    await wait(timeout);

    if (token.isCancelled()) {
      return;
    }

    dispatch(deviceActions.$fetchDeviceData());
  },
  $removeCurrentMeetingIfNotCheckedIn: () => async (dispatch, getState) => {
    const minutesLeftForCheckIn = minutesLeftForCheckInSelector(getState());
    const meeting = currentMeetingSelector(getState());

    if (minutesLeftForCheckIn !== null && minutesLeftForCheckIn < 0) {
      await api.deleteMeeting(meeting.id, true);
      dispatch(deviceActions.$fetchDeviceData());
    }
  },

  $updateClock,
  $startClock,

  $updateFullScreenState: action((isSupported, isFullScreen) => ({ isSupported, isFullScreen })),
  $initializeFullScreenSupport: () => dispatch => {
    const updateStatus = () => {
      dispatch(deviceActions.$updateFullScreenState(screenfull.enabled, screenfull.isFullscreen));
    };

    updateStatus();

    if (typeof screenfull.onchange === "function") {
      screenfull.onchange(updateStatus);
    }
  },
  toggleFullScreen: () => () => {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  },

  changeFontSize: action(fontSizeDelta => ({ fontSizeDelta })),

  $updateOfflineStatus,
  $initializeOfflineObserver: () => (dispatch, getState) => {
    const successCallback = result => {
      if (isInOfflineModeSelector(getState())) {
        dispatch(meetingActions.endAction());
        dispatch(deviceActions.$updateOfflineStatus(false));
      }

      return result;
    };

    const errorCallback = error => {
      if (error.response === undefined && !isInOfflineModeSelector(getState())) {
        dispatch(deviceActions.$updateOfflineStatus(true));
      }

      return Promise.reject(error);
    };

    axios.interceptors.response.use(successCallback, errorCallback);
  },

  $initializeApiVersionObserver: () => async () => {
    let currentVersion = undefined;

    const checkVersion = async () => {
      const response = await api.getApiVersion();

      if (response && response.version && currentVersion && currentVersion !== response.version) {
        window.location.reload();
      }

      if (response) {
        currentVersion = response.version;
      }
    };

    setInterval(checkVersion, 1000 * 60 * 5);
    await checkVersion();
  },

  $setIsSubscriptionCancelled,
  $markRemoved,
  disconnectDevice: () => async () => {
    await removeDevice();
    window.location.reload();
  },

  setLanguage: language => () => changeLanguage(language),

  $updateShowAllCalendarsView,
  $allCalendarsViewActivity,

  showAllCalendarsView: () => async (dispatch, getState) => {
    dispatch(deviceActions.$updateShowAllCalendarsView(true));
    dispatch(deviceActions.$allCalendarsViewActivity());
    dispatch(deviceActions.$fetchDeviceData());

    await waitUntilTrue(() => lastActivityOnShowCalendarsViewSelector(getState()) < Date.now() - 30 * 1000);

    dispatch(deviceActions.closeAllCalendarsView());
  },

  closeAllCalendarsView: () => dispatch => {
    dispatch(meetingActions.endAction());
    dispatch(deviceActions.$updateShowAllCalendarsView(false));
  }
};

export const meetingActions = {
  $startAction,
  endAction,
  $setActionError,
  $setActionSource,
  $setActionIsRetrying,
  $setActionSuccess,

  retry: () => (dispatch, getState) => {
    dispatch(meetingActions.$setActionIsRetrying());
    dispatch(currentActionSelector(getState()));
  },

  createMeeting: timeInMinutes => (dispatch, getState) => {
    dispatch(meetingActions.$startAction(meetingActions.createMeeting(timeInMinutes)));

    const roomName = calendarNameSelector(getState());
    const createMeetingPromise = api.createMeeting(
      timeInMinutes,
      i18next.t("meeting.quick-meeting-title", { roomName })
    );

    dispatch(meetingActions.$handleMeetingActionPromise(createMeetingPromise));
  },

  cancelMeeting: () => async (dispatch, getState) => {
    dispatch(meetingActions.$startAction(meetingActions.cancelMeeting()));

    const currentMeetingId = currentMeetingSelector(getState()).id;
    const deleteMeetingPromise = api.deleteMeeting(currentMeetingId, false);

    dispatch(meetingActions.$handleMeetingActionPromise(deleteMeetingPromise));
  },

  endMeeting: () => dispatch => {
    dispatch(meetingActions.$startAction(meetingActions.endMeeting()));

    dispatch(meetingActions.$updateCurrentMeeting({ endNow: true }));
  },

  checkInToMeeting: () => dispatch => {
    dispatch(meetingActions.$startAction(meetingActions.checkInToMeeting()));

    dispatch(meetingActions.$updateCurrentMeeting({ checkIn: true }));
  },

  extendMeeting: timeInMinutes => async dispatch => {
    dispatch(meetingActions.$startAction(meetingActions.extendMeeting(timeInMinutes)));

    dispatch(meetingActions.$updateCurrentMeeting({ extensionTime: timeInMinutes }));
  },

  startMeetingEarly: () => async dispatch => {
    dispatch(meetingActions.$startAction(meetingActions.startMeetingEarly()));

    dispatch(meetingActions.$updateCurrentMeeting({ checkIn: true, startNow: true }));
  },

  $updateCurrentMeeting: options => (dispatch, getState) => {
    const currentMeetingId = currentMeetingSelector(getState()).id;
    const updateMeetingPromise = api.updateMeeting(currentMeetingId, options);

    dispatch(meetingActions.$handleMeetingActionPromise(updateMeetingPromise));
  },

  $handleMeetingActionPromise: actionPromise => async dispatch => {
    try {
      await actionPromise;

      dispatch(deviceActions.$updateDeviceData(await getDeviceDetails()));
      dispatch(meetingActions.endAction());
    } catch (error) {
      console.error(error);

      dispatch(deviceActions.$updateDeviceData(await getDeviceDetails()));
      dispatch(meetingActions.$setActionError(error && error.response && error.response.status));
    }
  },

  createMeetingInAnotherRoom: (calendarId, timeInMinutes) => async (dispatch, getState) => {
    dispatch(meetingActions.$startAction(meetingActions.createMeetingInAnotherRoom(calendarId, timeInMinutes)));

    const roomName = calendarNameSelector(getState(), { calendarId });

    try {
      await api.createMeeting(timeInMinutes, i18next.t("meeting.quick-meeting-title", { roomName }), calendarId);

      dispatch(deviceActions.$updateDeviceData(await getDeviceDetails(true)));
      dispatch(meetingActions.$setActionSuccess());
    } catch (error) {
      console.error(error);
      dispatch(meetingActions.$setActionError());
    }
  }
};
