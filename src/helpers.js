export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DECIMALS = (10**18)

//shortcut to avoid passing around web3 connection
export const ether = (wei) => {
	if(wei) {
		return(wei / DECIMALS) //18 decimal places
	}
}

//Tokens and ether havesame decimal resolution
export const tokens = (n) => ether(n)
