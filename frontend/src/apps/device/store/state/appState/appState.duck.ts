import { makeReduxDuck } from "teedux";

interface IState {
  isSubscriptionCancelled: boolean;
  isRemoved: boolean;
  isInitialized: boolean;
  isOffline: boolean;
  showAllCalendarsView: boolean;

  // it is a timestamp
  lastActivityOnShowCalendarsView: null | number;
}
const initialState: IState = {
  isSubscriptionCancelled: false,
  isRemoved: false,
  isInitialized: false,
  isOffline: false,
  showAllCalendarsView: false,
  lastActivityOnShowCalendarsView: null
};

const duck = makeReduxDuck<IState>("appState", initialState);

const markInitialized = duck.definePayloadlessAction("MARK_INITIALIZED", () => ({
  isInitialized: true
}));
export const $markInitialized = markInitialized;

const markRemoved = duck.definePayloadlessAction("MARK_REMOVED", () => ({
  isRemoved: true
}));
export const $markRemoved = markRemoved;

const setIsSubscriptionCancelled = duck.defineAction<{ isSubscriptionCancelled: boolean }>(
  "SET_IS_SUBSCRIPTION_CANCELLED",
  (_, { isSubscriptionCancelled }) => ({
    isSubscriptionCancelled
  })
);
export const $setIsSubscriptionCancelled = (isSubscriptionCancelled: boolean) =>
  setIsSubscriptionCancelled({ isSubscriptionCancelled });

const updateOfflineStatus = duck.defineAction<{ isOffline: boolean }>("UPDATE_OFFLINE_STATUS", (_, { isOffline }) => ({
  isOffline
}));
export const $updateOfflineStatus = (isOffline: boolean) => updateOfflineStatus({ isOffline });

const updateShowAllCalendarsView = duck.defineAction<{ showAllCalendarsView: boolean }>(
  "UPDATE_SHOW_ALL_CALENDARS_VIEW",
  (_, { showAllCalendarsView }) => ({
    showAllCalendarsView
  })
);
export const $updateShowAllCalendarsView = (showAllCalendarsView: boolean) =>
  updateShowAllCalendarsView({ showAllCalendarsView });

const allCalendarsViewActivity = duck.defineAction<{ timestamp: number }>(
  "ALL_CALENDARS_VIEW_ACTIVITY",
  (_, { timestamp }) => ({
    lastActivityOnShowCalendarsView: timestamp
  })
);
export const $allCalendarsViewActivity = () => allCalendarsViewActivity({ timestamp: Date.now() });

export default duck.getReducer();
