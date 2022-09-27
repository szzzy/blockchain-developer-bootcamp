
/*
  触发对应actions时返回state

  可以把rootReducer想象成一个监视者
  监视action被触发
  然后返回state
  redux dev tools会显示出来state
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