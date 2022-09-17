//Contracts
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')

//import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from '../test/helpers'
//it's hard to extract them from directory outside of the scripts
//so redefined them

const tokens = (n) =>{
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}

const EVM_REVERT = 'VM Exception while processing transaction: revert'

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

//token same as ether
const ether = (n) => tokens(n)

const wait = (seconds) =>{
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async function(callback) {

	try {
		//fetch accounts from wallet - these are unlocked
		const accounts = await web3.eth.getAccounts()
		//console.log(accounts)

		//fetch the deployed token
		const token = await Token.deployed()
		console.log('Token fetched', token.address)

		//fetch the deployed exchange
		const exchange = await Exchange.deployed()
		console.log('Exchange fetched', exchange.address)

		//give tokens to account[1]
		const sender = accounts[0]
		const receiver = accounts[1]
		let amount = web3.utils.toWei('10000') //10,000 tokens

		await token.transfer(receiver, amount, {from: sender})
		console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`)
		
		//set up exchange user
		const user1 = accounts[0]
		const user2 = accounts[1]

		//user1 deposits ether
		amount = 1
		await exchange.depositEther({from: user1, value: ether(1)})
		console.log(`Deposited ${amount} Ether from ${user1}`)

		//user2 Approves Tokens
		amount = 10000
		await token.approve(exchange.address, tokens(10000), {from: user2})
		console.log(`Approved ${amount} tokens from ${user2}`)

		//user2 deposits token
		await exchange.depositToken(token.address, tokens(10000), {from: user2})
		console.log(`Deposited ${amount} tokens from ${user2}`)

		///////////////////////////////////////////////////////
		//seed a cancelled order

		//user1 makes order to get tokens
		let result
		let orderId
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), {from: user1})
		console.log(`Made order from ${user1}`)
		//console.log(result.logs[0].args.id.toString())
		//user1 cancells order
		orderId = result.logs[0].args.id
		await exchange.cancelOrder(orderId, {from: user1})
		console.log(`Cancelled order from ${user1}`)

		////////////////////////////////////////////////////////
		//seed Filled Orders
		//

		//user1 makes order
		result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), {from: user1})
		console.log(`made order from ${user1}`)
		//user2 fills order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, {from: user2})
		console.log(`Filled order from ${user1}`)
		//wait 1 second
		await wait(1)

		//user1 makes another order
		result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), {from: user1})
		console.log(`made order from ${user1}`)
		//user2 fills another order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, {from: user2})
		console.log(`Filled order from ${user1}`)
		//wait 1 second
		await wait(1)

		//user1 makes final order
		result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), {from: user1})
		console.log(`made order from ${user1}`)
		//user2 fills final order
		orderId = result.logs[0].args.id
		await exchange.fillOrder(orderId, {from: user2})
		console.log(`Filled order from ${user1}`)
		//wait 1 second
		await wait(1)

		///////////////////////////////////////////////
		//seed open orders
		//

		//user1 makes 10 orders
		for(let i=1; i<=10; i++) {
			result = await exchange.makeOrder(token.address, tokens(10*i), ETHER_ADDRESS, ether(0.01), {from: user1})
			console.log(`made order from ${user1}`)
			//wait 1 second
			await wait(1)
		}

		//user2 makes 10 orders
		for(let i=1; i<=10; i++) {
			result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10*i), {from: user2})
			console.log(`made order from ${user2}`)
			//wait 1 second
			await wait(1)
		}

	}
	catch(error) {
		console.log(error)
	}
	callback()
}