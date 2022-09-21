import { combineReducer } from 'redux';


function web3(state = {}, action) {
	switch(action.type) {
		default:
			return state
	}
}

const rootReducer = combineReducer({
	web3: web3
})

export default rootReducer