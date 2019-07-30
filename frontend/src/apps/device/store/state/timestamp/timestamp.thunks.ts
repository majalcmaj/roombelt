import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { $updateClock } from "./timestamp.duck";

type TRootState = {}; // TODO should be defined on store level
type ThunkResult<R> = ThunkAction<R, TRootState, undefined, Action>;

export const $startClock = (): ThunkResult<void> => dispatch => {
  dispatch($updateClock(Date.now()));

  window.setInterval(() => dispatch($updateClock(Date.now())), 10 * 1000);
};
