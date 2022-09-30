
/*
  选择器
  从redux存储中(state)读取数据
  在mapStateToProps，可以添加选择器，这样可以调用props对应的成员
  如：Navbar.js的 account: accountSelector(state)
  这样可以用{this.props.account}读取数据
*/

import { get } from 'lodash'
import { createSelector } from 'reselect'
import moment from 'moment'
import { ETHER_ADDRESS, GREEN, RED, ether, tokens } from '../helpers'

const account = state => get(state, 'web3.account')//prevent error that web3 don't exist
export const accountSelector = createSelector(account, (account) => { return account })//完整写法

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e=> e)

//const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
export const contractsLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
	filledOrders,
	(orders) => {
		//Sort orders by date ascending for price comparison
		orders = orders.sort((a,b) => a.timestamp - b.timestamp)
		//decorate the orders
		orders = decorateFilledOrders(orders)
		//Sort orders by date descending for display
		orders = orders.sort((a,b) => b.timestamp - a.timestamp)
		return orders
	}
)

const decorateFilledOrders = (orders) => {
	//Track previous order to compare history
	let previousOrder = orders[0]
	return(
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateFilledOrder(order, previousOrder)
			previousOrder = order //update the previous order once it's decorated
			return order
		})
	)
}

const decorateOrder = (order) => {
	let etherAmount
	let tokenAmount
	
	if(order.tokenGive == ETHER_ADDRESS) {
		etherAmount = order.amountGive
		tokenAmount = order.amountGet
	} else {
		etherAmount = order.amountGet
		tokenAmount = order.amountGive
	}

	//calculate token price to 5 decimal places
	const precision = 100000
	let tokenPrice = (etherAmount / tokenAmount)
	tokenPrice = Math.round(tokenPrice * precision) / precision

	return({
		...order,
		etherAmount: ether(etherAmount),
		tokenAmount: tokens(tokenAmount),
		tokenPrice: tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format('M/D h:mm:ss a')
	})
}

const decorateFilledOrder = (order, previousOrder) => {
	return ({
		...order,
		tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
	})
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
	//Show green price if only one order exists
	if(previousOrder.id === orderId) {
		return GREEN
	}

	//Show green price if order price higher than previous order
	//Show red price if order price lower than previous order
	if(previousOrder.tokenPrice <= tokenPrice) {
		return GREEN //'success' class in bootstrap
	} else {
		return RED //danger
	}
}