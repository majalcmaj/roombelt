import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import reducer from "../state/reducer";

const logger = createLogger({ collapsed: true });

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;


export const makeStore = (initialState = null) => initialState ? 
  createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk, logger))) :
  createStore(reducer, composeEnhancers(applyMiddleware(thunk, logger)));
  
export default makeStore();