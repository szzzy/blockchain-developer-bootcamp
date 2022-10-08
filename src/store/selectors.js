
/*
  选择器
  从redux存储中(state)读取数据
  在mapStateToProps，可以添加选择器，这样可以调用props对应的成员
  如：Navbar.js的 account: accountSelector(state)
  这样可以用{this.props.account}读取数据
*/

import { get, reject, groupBy, maxBy, minBy } from 'lodash'
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

//All Orders
const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)
const allOrders = state => get(state, 'exchange.allOrders.data', [])


//Cancelled Orders
const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o)


//Filled Orders
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
	
	if(order.tokenGive === ETHER_ADDRESS) {
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

const openOrders = state => {
	const all = allOrders(state)
	const cancelled = cancelledOrders(state)
	const filled = filledOrders(state)

	//reject cancelled or filled order
	const openOrders = reject(all, (order) => {
		const orderFilled = filled.some((o) => o.id === order.id)
		const orderCancelled = cancelled.some((o) => o.id === order.id)
		return(orderFilled || orderCancelled)
	})

	return openOrders
}

const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)

//Create the order book
export const orderBookSelector = createSelector(
	openOrders,
	(orders) => {
		//Decorate orders
		orders = decorateOrderBookOrders(orders)
		//Group orders by "orderType"
		orders = groupBy(orders, 'orderType')
		//Fetch buy orders
		const buyOrders = get(orders, 'buy', [])
		//Sort buy orders by token price
		orders = {
			...orders,
			buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
		}
		//Fetch sell orders
		const sellOrders = get(orders, 'sell', [])
		//Sort sell orders by token price
		orders = {
			...orders,
			sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
		}
		return orders
	}
)

const decorateOrderBookOrders = (orders) => {
	return(
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateOrderBookOrder(order)
			return(order)
		})
	)
}

const decorateOrderBookOrder = (order) => {
	const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	return({
		...order,
		orderType: orderType,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED),
		orderFillClass: (orderType === 'buy' ? 'sell' : 'buy')
	})
}

//for MyTransactions.js
export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

export const myFilledOrdersSelector = createSelector(
	account,
	filledOrders,
	(account, orders) => {
		//find our orders
		orders = orders.filter((o) => o.user === account || o.userFill ===account)
		//sort by date ascending
		orders = orders.sort((a, b) => a.timestamp - b.timestamp)
		//decorate orders - add display attributes
		orders = decorateMyFilledOrders(orders, account)
		return orders
	}
)

const decorateMyFilledOrders = (orders, account) => {
	return(
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateMyFilledOrder(order, account)
			return(order)
		})
	)
}

const decorateMyFilledOrder = (order, account) => {
	const myOrder = order.user === account

	let orderType
	if(myOrder) {
		orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
	} else {
		orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
	}

	return({
		...order,
		orderType,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED),
		orderSign: (orderType === 'buy' ? '+' : '-')
	})
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)

export const myOpenOrderSelector = createSelector(
	account,
	openOrders,
	(account, orders) => {
		//find our orders
		orders = orders.filter((o) => o.user === account)
		//decorate orders - add display attributes
		orders = decorateMyOpenOrders(orders, account)
		//sort by date ascending
		orders = orders.sort((a, b) => b.timestamp - a.timestamp)
		return orders
	}
)

const decorateMyOpenOrders = (orders, account) => {
	return(
		orders.map((order) => {
			order = decorateOrder(order)
			order = decorateMyOpenOrder(order, account)
			return(order)
		})
	)
}

const decorateMyOpenOrder = (order, account) => {
	let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

	return({
		...order,
		orderType,
		orderTypeClass: (orderType === 'buy' ? GREEN : RED),
	})
}

//PriceChart.js
export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

export const priceChartSelector = createSelector(
	filledOrders,
	(orders) => {
		//sort orders by date ascending to compare history
		orders = orders.sort((a,b) => a.timestamp - b.timestamp)
		//decorate orders - add display attributes
		orders = orders.map((o) => decorateOrder(o))
		//let last 2 order for final price & price change
		let secondLastOrder, lastOrder
		[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
		//get last order price
		const lastPrice = get(lastOrder, 'tokenPrice', 0)
		//get second last order price
		const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

		return({
			lastPrice,
			lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
			series: [{
				data: buildGraphData(orders)
			}]
		})
	}
)

const buildGraphData = (orders) => {
	// Group the orders by hour for graph
	orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())
	//get each hour where data exists
	const hours = Object.keys(orders)
	//会返回一个由一个给定对象的自身可枚举属性组成的数组，也就是说hours包含的值能够作为key遍历orders
	//build the graph series
	const graphData = hours.map((hour) => {
		//fetch all the orders from current hour
		const group = orders[hour]
		//calculate price values - open, high, low, close
		const open = group[0] // first order
		const high = maxBy(group, 'tokenPrice') // high price
		const low = minBy(group, 'tokenPrice') // low price
		const close = group[group.length - 1] // last order

		return({
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
		})
	})
	return graphData
}

const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, (status) => status)

const orderFilling = state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, (status) => status)
