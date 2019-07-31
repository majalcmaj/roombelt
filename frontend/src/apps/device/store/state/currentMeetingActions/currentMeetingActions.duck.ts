import { makeReduxDuck } from "teedux";

interface IState {
  source: null;
  currentAction: null;
  isRetrying: boolean;
  isError: boolean;
  errorStatusCode: null;
  isSuccess: boolean;
}

const initialState: IState = {
  source: null,
  currentAction: null,
  isRetrying: false,
  isError: false,
  errorStatusCode: null,
  isSuccess: false
};

const duck = makeReduxDuck<IState>("currentMeetingActions", initialState);

const setActionSource = duck.defineAction<{ source: null }>("SET_ACTION_SOURCE", (_, { source }) => ({
  source
}));
export const $setActionSource = (source: null) => setActionSource({ source });

const startAction = duck.defineAction<{ currentAction: null }>("START_ACTION", (_, { currentAction }) => ({
  currentAction,
  isError: false
}));
export const $startAction = (currentAction: null) => startAction({ currentAction });

const setActionIsRetrying = duck.definePayloadlessAction("SET_ACTION_IS_RETRYING", () => ({
  isRetrying: true
}));
export const $setActionIsRetrying = setActionIsRetrying;

const setActionError = duck.defineAction<{ errorStatusCode: null }>("SET_ACTION_ERROR", (_, { errorStatusCode }) => ({
  errorStatusCode,
  isError: true,
  isRetrying: false
}));
export const $setActionError = (errorStatusCode: null) => setActionError({ errorStatusCode });

const setActionSuccess = duck.definePayloadlessAction("SET_ACTION_SUCCESS", () => ({
  isSuccess: true,
  isRetrying: false
}));
export const $setActionSuccess = setActionSuccess;

export const endAction = duck.definePayloadlessAction("END_ACTION", () => initialState);

export default duck.getReducer();
