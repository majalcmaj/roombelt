import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import reducer from "../state/reducer";

const logger = createLogger({ collapsed: true });

export const makeStore = (initialState = null) => initialState ? 
  createStore(reducer, initialState, applyMiddleware(thunk, logger)) : 
  createStore(reducer, applyMiddleware(thunk, logger))
  
export default makeStore();