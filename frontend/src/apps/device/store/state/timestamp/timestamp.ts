import { makeReduxDuck } from 'teedux'
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

const initialState = { value: 0 };

const duck = makeReduxDuck<{ value: number }>('timestamp', initialState)

const updateClock = duck.defineAction<{ timestamp: number }>(
    'UPDATE_CLOCK',
    (_, { timestamp }) => ({ value: timestamp })
)
export const $updateClock = (timestamp: number) => updateClock({ timestamp })

type TRootState = {} // TODO should be defined on store level
type ThunkResult<R> = ThunkAction<R, TRootState, undefined, Action>;

export const $startClock = (): ThunkResult<void> => dispatch => {
    dispatch($updateClock(Date.now()));

    window.setInterval(() => dispatch($updateClock(Date.now())), 10 * 1000);
  }

export default duck.getReducer()
