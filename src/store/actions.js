
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