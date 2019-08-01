import {
  $setActionSource,
  $startAction,
  $setActionIsRetrying,
  $setActionError,
  $setActionSuccess,
  endAction
} from "../state/currentMeetingActions/currentMeetingActions.duck";

import { $updateDeviceData } from "../state/device/device.duck";

import { calendarNameSelector, currentActionSelector, currentMeetingSelector } from "../selectors/selectors";

import * as api from "services/api";

import i18next from "i18next";

import { getDeviceDetails } from "services/api";

const createMeetingInAnotherRoom = (calendarId, timeInMinutes) => async (dispatch, getState) => {
  dispatch($startAction(createMeetingInAnotherRoom(calendarId, timeInMinutes)));

  const roomName = calendarNameSelector(getState(), { calendarId });

  try {
    await api.createMeeting(timeInMinutes, i18next.t("meeting.quick-meeting-title", { roomName }), calendarId);

    dispatch($updateDeviceData(await getDeviceDetails(true)));
    dispatch($setActionSuccess());
  } catch (error) {
    console.error(error);
    dispatch($setActionError());
  }
};

const $handleMeetingActionPromise = actionPromise => async dispatch => {
  try {
    await actionPromise;

    dispatch($updateDeviceData(await getDeviceDetails()));
    dispatch(endAction());
  } catch (error) {
    console.error(error);

    dispatch($updateDeviceData(await getDeviceDetails()));
    dispatch($setActionError(error && error.response && error.response.status));
  }
};

const $updateCurrentMeeting = options => (dispatch, getState) => {
  const currentMeetingId = currentMeetingSelector(getState()).id;
  const updateMeetingPromise = api.updateMeeting(currentMeetingId, options);

  dispatch($handleMeetingActionPromise(updateMeetingPromise));
};

const startMeetingEarly = () => async dispatch => {
  dispatch($startAction(startMeetingEarly()));

  dispatch($updateCurrentMeeting({ checkIn: true, startNow: true }));
};

const endMeeting = () => dispatch => {
  dispatch($startAction(endMeeting()));

  dispatch($updateCurrentMeeting({ endNow: true }));
};

const checkInToMeeting = () => dispatch => {
  dispatch($startAction(checkInToMeeting()));

  dispatch($updateCurrentMeeting({ checkIn: true }));
};

const extendMeeting = timeInMinutes => async dispatch => {
  dispatch($startAction(extendMeeting(timeInMinutes)));

  dispatch($updateCurrentMeeting({ extensionTime: timeInMinutes }));
};

const retry = () => (dispatch, getState) => {
  dispatch($setActionIsRetrying());
  dispatch(currentActionSelector(getState()));
};

const createMeeting = timeInMinutes => (dispatch, getState) => {
  dispatch($startAction(createMeeting(timeInMinutes)));

  const roomName = calendarNameSelector(getState());
  const createMeetingPromise = api.createMeeting(timeInMinutes, i18next.t("meeting.quick-meeting-title", { roomName }));

  dispatch($handleMeetingActionPromise(createMeetingPromise));
};

const cancelMeeting = () => async (dispatch, getState) => {
  dispatch($startAction(cancelMeeting()));

  const currentMeetingId = currentMeetingSelector(getState()).id;
  const deleteMeetingPromise = api.deleteMeeting(currentMeetingId, false);

  dispatch($handleMeetingActionPromise(deleteMeetingPromise));
};

export const meetingActions = {
  endAction,
  $setActionSource,
  retry,
  createMeeting,
  cancelMeeting,
  endMeeting,
  checkInToMeeting,
  extendMeeting,
  startMeetingEarly,
  createMeetingInAnotherRoom
};
