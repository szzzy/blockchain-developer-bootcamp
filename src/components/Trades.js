import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	filledOrdersLoadedSelector,
	filledOrdersSelector
} from '../store/selectors'


class Trades extends Component {
	render() {
		return (
			<div className="card bg-dark text-white">
				<div className="card-header">
					card title6
				</div>
				<div className="card-body">

					<table className="table table-dark table-sm small">
						<thead>
							<tr>
								<th>Time</th>
								<th>DAPP</th>
								<th>DAPP/ETH</th>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tr>
						</thead>
					</table>

				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		filledOrdersLoaded: filledOrdersLoadedSelector(state),
		filledOrders: filledOrdersSelector(state),
	}
}

export default connect(mapStateToProps)(Trades)