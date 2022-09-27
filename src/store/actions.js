
/*
   在此项目中, action.js 中的函数export给 interactions.js 使用
   这些函数需要通过 dispatch 来调用
   这里的 action 和 reducers.js 有关系
 
   action: 行为, 对 store 的操作均通过行为来实现, 也就是都需要调用这里面的函数

   被调用后返回对应的action和状态
 */

//WEB3
export function web3Loaded (connection) {
	return {
		type: 'WEB3_LOADED',
		connection: connection
	}
}

export function web3AccountLoaded (account) {
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account: account
	}
}

//TOKEN
export function tokenLoaded (contract) {
	return {
		type: 'TOKEN_LOADED',
		contract: contract
	}
}

//EXCHANGE
export function exchangeLoaded (contract) {
	return {
		type: 'EXCHANGE_LOADED',
		contract: contract
	}
}