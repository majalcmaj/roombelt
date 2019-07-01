import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import rootReducer from "./reducers";

const logger = createLogger({ collapsed: true });

export const makeStore = (initialState = null) => initialState ? 
  createStore(rootReducer, initialState, applyMiddleware(thunk, logger)) : 
  createStore(rootReducer, applyMiddleware(thunk, logger))
  
export default makeStore();
