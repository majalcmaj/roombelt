import { combineReducers } from "redux";

import timestamp from "./state/timestamp/timestamp.duck";
import device from "./state/device/device.duck";
import appState from "./state/appState/appState.duck";
import currentMeetingActions from "./state/currentMeetingActions/currentMeetingActions.duck";
import displayOptions from './state/displayOptions/displayOptions.duck'

export default combineReducers({
  displayOptions,
  appState,
  timestamp,
  device,
  currentMeetingActions
});
