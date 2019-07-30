import { makeReduxDuck } from "teedux";

const initialState = { value: 0 };

const duck = makeReduxDuck<{ value: number }>("timestamp", initialState);

const updateClock = duck.defineAction<{ timestamp: number }>("UPDATE_CLOCK", (_, { timestamp }) => ({
  value: timestamp
}));
export const $updateClock = (timestamp: number) => updateClock({ timestamp });

export default duck.getReducer();
