
/*
  触发对应actions时返回state

  可以把rootReducer想象成一个监视者
  监视action被触发
  然后返回state
  redux dev tools会显示出来state
  往redux存储里添加state数据

  还可以用于选择器Selector
  这里往state里添加，Selector可以获取到里面的数据
  比如get(state, 'exchange.filledOrders.loaded', false)
*/


import { combineReducers } from 'redux';

function web3(state = {}, action) {
	switch(action.type) {
		case 'WEB3_LOADED':
			return { ...state, connection: action.connection}
		case 'WEB3_ACCOUNT_LOADED':
			return { ...state, account: action.account}
		default:
			return state
	}
}

function token(state = {}, action) {
	switch(action.type) {
		case 'TOKEN_LOADED':
			return { ...state, loaded: true, contract: action.contract}
		default:
			return state
	}
}

function exchange(state = {}, action) {
	switch(action.type) {
		case 'EXCHANGE_LOADED':
			return { ...state, loaded: true, contract: action.contract}
		case 'CANCELLED_ORDERS_LOADED':
			return { ...state, cancelledOrders: { loaded: true, data: action.cancelledOrders } }
		case 'FILLED_ORDERS_LOADED':
			return { ...state, filledOrders: { loaded: true, data: action.filledOrders } }
		case 'ALL_ORDERS_LOADED':
			return { ...state, allOrders: { loaded: true, data: action.allOrders } }
		default:
			return state
	}
}

const rootReducer = combineReducers({
	web3: web3,
	token: token,
	exchange: exchange
})

export default rootReducer