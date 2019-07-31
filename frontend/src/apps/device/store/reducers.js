import { deviceActions, meetingActions } from "apps/device/store/actions";

import { combineReducers } from "redux";
import { getFontSize, setFontSize } from "services/persistent-store";

import timestamp from "./state/timestamp/timestamp.duck";
import device from "./state/device/device.duck";
import appState from "./state/appState/appState.duck";

const defaultCurrentMeetingActionsState = {
  source: null,
  currentAction: null,
  isRetrying: false,
  isError: false,
  errorStatusCode: null,
  isSuccess: false
};

const currentMeetingActions = (state = defaultCurrentMeetingActionsState, action) => {
  switch (action.type) {
    case meetingActions.$setActionSource:
      return { ...state, source: action.source };
    case meetingActions.$startAction:
      return { ...state, currentAction: action.currentAction, isError: false };
    case meetingActions.$setActionIsRetrying:
      return { ...state, isRetrying: true };
    case meetingActions.$setActionError:
      return { ...state, isError: true, errorStatusCode: action.errorStatusCode, isRetrying: false };
    case meetingActions.$setActionSuccess:
      return { ...state, isSuccess: true, isRetrying: false };
    case meetingActions.endAction:
      return defaultCurrentMeetingActionsState;
    default:
      return state;
  }
};

const displayOptions = (state = { isFullScreen: null, isSupported: null, fontSize: getFontSize() }, action) => {
  switch (action.type) {
    case deviceActions.$updateFullScreenState:
      return { ...state, isFullScreen: action.isFullScreen, isSupported: action.isSupported };
    case deviceActions.changeFontSize:
      const fontSize = Math.max(state.fontSize + action.fontSizeDelta, 0.1);
      setFontSize(fontSize);
      return { ...state, fontSize };
    default:
      return state;
  }
};

export default combineReducers({
  displayOptions,
  appState,
  timestamp,
  device,
  currentMeetingActions
});
