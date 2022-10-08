import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	web3Selector,
	exchangeSelector,
	tokenSelector,
	accountSelector,
	balancesLoadingSelector,
	etherBalanceSelector,
	tokenBalanceSelector,
	exchangeEtherBalanceSelector,
	exchangeTokenBalanceSelector
} from '../store/selectors'
import { loadBalances } from '../store/interactions'

class Balance extends Component {

	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
		const { dispatch, web3, exchange, token, account } = props
		await loadBalances(dispatch, web3, exchange, token, account)
	}

	render() {
		return (
			<div className="card bg-dark text-white">
				<div className="card-header">
					Balance
				</div>
				<div className="card-body">
					
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	console.log({
		account: accountSelector(state),
		exchange: exchangeSelector(state),
		token: tokenSelector(state),
		web3: web3Selector(state),
		balancesLoading: balancesLoadingSelector(state),
		etherBalance: etherBalanceSelector(state),
		tokenBalance: tokenBalanceSelector(state),
		exchangeEtherBalance: exchangeEtherBalanceSelector(state),
		exchangeTokenBalance: exchangeTokenBalanceSelector(state)
	})
	
	return {
		account: accountSelector(state),
		exchange: exchangeSelector(state),
		token: tokenSelector(state),
		web3: web3Selector(state),
		balancesLoading: balancesLoadingSelector(state),
		etherBalance: etherBalanceSelector(state),
		tokenBalance: tokenBalanceSelector(state),
		exchangeEtherBalance: exchangeEtherBalanceSelector(state),
		exchangeTokenBalance: exchangeTokenBalanceSelector(state)
	}
}

export default connect(mapStateToProps)(Balance)