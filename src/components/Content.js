import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors';
import { loadAllOrders } from '../store/interactions';
import OrderBook from './OrderBook';
import Trades from './Trades'; //Trades is default export

class Content extends Component {

	componentDidMount() {
	 this.loadBlockchainData(this.props.dispatch)
	}

	async loadBlockchainData(dispatch) {
	 await loadAllOrders(this.props.exchange, dispatch)
	}

	render() {
		return (
			<div className="content">
				<div className="vertical-split">
					<div className="card bg-dark text-white">
						<div className="card-header">
							Card Title
						</div>
						<div className="card-body">
							<p className="card-text">some example i am from china so i love you why don't you show me your face</p>
							<a href="/#" className="card-link">card link</a>
						</div>
					</div>
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
					<div className="card bg-dark text-white">
						<div className="card-header">
							Card Title4
						</div>
						<div className="card-body">
							<p className="card-text">some example4</p>
							<a href="/#" className="card-link">card link4</a>
						</div>
					</div>
					<div className="card bg-dark text-white">
						<div className="card-header">
							card titile5
						</div>
						<div className="card-body">
							<p className="card-text">some content5</p>
							<a href="/#" className="card-link">card-link5</a>
						</div>
					</div>
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