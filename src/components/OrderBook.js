import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import {
	orderBookLoadedSelector,
	orderBookSelector,
	orderFillingSelector,
	exchangeSelector,
	accountSelector,
} from '../store/selectors'
import { fillOrder } from '../store/interactions'

const renderOrder = (dispatch, exchange, order, account) => {
	return(
		<tr key={order.id}>
			<td>{order.tokenAmount}</td>
			<td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
			<td>{order.etherAmount}</td>
			<td 
				className="text-muted pointer"
				onClick={(e) => {
					fillOrder(dispatch, exchange, order, account)
				}}
			>Fill</td>
		</tr>
	)
}

const showOrderBook = (props) => {
	const { orderBook, dispatch, exchange, account } = props
	return(
		<tbody>
			{orderBook.sellOrders.map((order) => renderOrder(dispatch, exchange, order, account))}
			<tr>
				<th>DAPP</th>
				<th>DAPP/ETH</th>
				<th>ETH</th>
			</tr>
			{orderBook.buyOrders.map((order) => renderOrder(dispatch, exchange, order, account))}
		</tbody>
	)
}

class OrderBook extends Component {
	render() {
		//console.log(this.props.orderBookLoaded, this.props.orderBook)
		return (
			<div className="vertical">
				<div className="card bg-dark text-white">
					<div className="card-header">
						Order Book
					</div>
					<div className="card-body order-book">
						<table className="table table-dark table-sm small">
							{ this.props.showOrderBook ? showOrderBook(this.props) : <Spinner type='table' /> }
						</table>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	const openBookLoaded = orderBookLoadedSelector(state)
	const orderFilling = orderFillingSelector(state)
	return {
		orderBook: orderBookSelector(state),
		showOrderBook: openBookLoaded && !orderFilling,
		exchange: exchangeSelector(state),
		account: accountSelector(state)
	}
}

export default connect(mapStateToProps)(OrderBook)