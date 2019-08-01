import { combineReducers } from "redux";

import timestamp from "./timestamp/timestamp.duck";
import device from "./device/device.duck";
import appState from "./appState/appState.duck";
import currentMeetingActions from "./currentMeetingActions/currentMeetingActions.duck";
import displayOptions from './displayOptions/displayOptions.duck'

export default combineReducers({
  displayOptions,
  appState,
  timestamp,
  device,
  currentMeetingActions
});
