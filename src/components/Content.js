import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors';
import { loadAllOrders, subscribeToEvents } from '../store/interactions';
import OrderBook from './OrderBook';
import Trades from './Trades'; //Trades is default export
import MyTransactions from './MyTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';

class Content extends Component {

	componentDidMount() {
		this.loadBlockchainData()
	}

	async loadBlockchainData() {
		const { dispatch, exchange } = this.props
		await loadAllOrders(exchange, dispatch)
		await subscribeToEvents(exchange, dispatch)
	}

	render() {
		return (
			<div className="content">
				<div className="vertical-split">
					<Balance />
					<div className="card bg-dark text-white">
						<div className="card-header">
							card titile2
						</div>
						<div className="card-body">
							<p className="card-text">some content2</p>
							<a href="/#" className="card-link">card-link</a>
						</div>
					</div>
				</div>

				<OrderBook />

				<div className="vertical-split">
					<PriceChart />
					
					<MyTransactions />

				</div>

				<Trades />

			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		exchange: exchangeSelector(state)
	}
}

export default connect(mapStateToProps)(Content)