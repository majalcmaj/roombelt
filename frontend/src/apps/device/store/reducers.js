import { deviceActions } from "apps/device/store/actions";

import { combineReducers } from "redux";
import { getFontSize, setFontSize } from "services/persistent-store";

import timestamp from "./state/timestamp/timestamp.duck";
import device from "./state/device/device.duck";
import appState from "./state/appState/appState.duck";
import currentMeetingActions from "./state/currentMeetingActions/currentMeetingActions.duck";

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
