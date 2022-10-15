//handle all of blockchain interations

/*
  用户的交互函数
  会通过dispatch触发相应的actions
*/

import Web3 from 'web3';
import {
	web3Loaded,
	web3AccountLoaded,
	tokenLoaded,
	exchangeLoaded,
	cancelledOrdersLoaded,
	filledOrdersLoaded,
	allOrdersLoaded,
	orderCancelling,
	orderCancelled,
	orderFilling,
	orderFilled,
	etherBalanceLoaded,
	tokenBalanceLoaded,
	exchangeEtherBalanceLoaded,
	exchangeTokenBalanceLoaded,
	balancesLoaded,
	balancesLoading
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS } from '../helpers'


export const loadWeb3 = (dispatch) => {
	const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
	dispatch(web3Loaded(web3))
	return web3
}

export const loadAccount = async (web3, dispatch) => {
	const accounts = await web3.eth.getAccounts()
	const account = accounts[0]
	dispatch(web3AccountLoaded(account))
	return account
}

export const loadToken = async (web3, networkId, dispatch) => {
	try {
		const token =  new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
		dispatch(tokenLoaded(token))
		return token
	} catch (error) {
		console.log('Contract not deployed to the current network. Please select another network with Metamask.')
		return null
	}
}

export const loadExchange = async (web3, networkId, dispatch) => {
	try {
		const exchange =  new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
		dispatch(exchangeLoaded(exchange))
		return exchange
	} catch (error) {
		console.log('Contract not deployed to the current network. Please select another network with Metamask.')
		return null
	}
}

export const loadAllOrders = async (exchange, dispatch) => {
	//Fetch cancelled orders with the "Cancel" event stream
	const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })//search in the entire blockchain
	//format cancelled orders
	const cancelledOrders = cancelStream.map((event)=>event.returnValues)
	//add cancelled orders to the redux store
	dispatch(cancelledOrdersLoaded(cancelledOrders))

	//Fetch filled orders with the "Trade" event stream
	const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
	//format filled orders
	const filledOrders = tradeStream.map((event)=>event.returnValues)
	//add filled orders to the redux store
	dispatch(filledOrdersLoaded(filledOrders))

	//Fetch all orders with the "Order" event stream. Load order stream
	const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
	//format order stream
	const allOrders = orderStream.map((event)=>event.returnValues)
	//add open orders to the redux store
	dispatch(allOrdersLoaded(allOrders))
}

export const cancelOrder = (dispatch, exchange, order, account) =>{
	exchange.methods.cancelOrder(order.id).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(orderCancelling())
	})
	.on('error', (error) => {
		console.log(error)
		window.alert('There was an error in cancelling order!')
	})
}

// 订阅事件, 当事件发生变化时, 我们会收到该消息，并且重新加载
//subscribe to events to reload the page or reload the component
//any time the status change, update the status with the event that was triggered
export const subscribeToEvents = async (exchange, dispatch) => {
	exchange.events.Cancel({}, (error, event) => {
		dispatch(orderCancelled(event.returnValues))
	})

	exchange.events.Trade({}, (error, event) => {
		dispatch(orderFilled(event.returnValues))
	})

	exchange.events.Deposit({}, (error, event) => {
		dispatch(balancesLoaded())
	})

	exchange.events.Withdraw({}, (error, event) => {
		dispatch(balancesLoaded())
	})
}

export const fillOrder = (dispatch, exchange, order, account) =>{
	exchange.methods.fillOrder(order.id).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(orderFilling())
	})
	.on('error', (error) => {
		console.log(error)
		window.alert('There was an error happend in filling order!')
	})
}

export const loadBalances = async (dispatch, web3, exchange, token, account) => {
	//Ether balance in wallet
	const etherBalance = await web3.eth.getBalance(account)
	dispatch(etherBalanceLoaded(etherBalance))

	//Token balance in wallet
	const tokenBalance = await token.methods.balanceOf(account).call()
	dispatch(tokenBalanceLoaded(tokenBalance))

	//Ether balance in exchange
	const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
	dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

	//Token balance in exchange
	//console.log(token.options.address)
	const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
	dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

	//Trigger all balances loaded
	dispatch(balancesLoaded())
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
	exchange.methods.depositEther().send({ from: account, value: web3.utils.toWei(amount, 'ether') })
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert(`There was an error in depositting ether`)
	})
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
	exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({ from: account })
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert(`There was an error in withdrawing ether`)
	})
}

export const depositToken = (dispatch, exchange, web3, token, amount, account) => {
	amount = web3.utils.toWei(amount, 'ether')

	token.methods.approve(exchange.options.address, amount).send({ from: account })
	.on('transactionHash', (hash) => {
		exchange.methods.depositToken(token.options.address, amount).send({ from: account })
		.on('transactionHash', (hash) => {
			dispatch(balancesLoading())
		})
		.on('error', (error) => {
			console.log(error)
			window.alert(`There was an error in depositting tokens`)
		})
	})
}

export const withdrawToken = (dispatch, exchange, web3, token, amount, account) => {
	exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account })
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert(`There was an error in withdrawing token`)
	})
}