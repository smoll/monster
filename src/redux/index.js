import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const reducer = combineReducers(require('./modules/index'))

const prodMiddleware = [thunk]
const devMiddleware = [logger]

export default function createAppStore(initialValue = {}) {
  let store

  if (process.env.NODE_ENV === 'development') {
    // Development mode with Redux DevTools support enabled.
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Prevents Redux DevTools from re-dispatching all previous actions.
      shouldHotReload: false,
    }) : compose
    // Create the redux store.
    store = createStore(reducer, initialValue, composeEnhancers(applyMiddleware(...prodMiddleware, ...devMiddleware)))
  } else {
    // Production mode.
    store = createStore(reducer, initialValue, applyMiddleware(...prodMiddleware))
  }

  return store
}
