
/*
  和中间件有关
  可以让js文件使用store
  这里是在index.js
  <Provider store={configureStore()}>
  	<App />
  </Provider>,
*/

import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'


const loggerMiddleware = createLogger()
const middleware = []

//for redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState) {
	return createStore(
		rootReducer,
		preloadedState,
		composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
	)
}