import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'

class MyTransactions extends Component {
	render() {
		return (
			<div className="card bg-dark text-white">
				<div className="card-header">
					My Transactions
				</div>
				<div className="card-body">
					<Tabs defaultActiveKey="trades" className="bg-dark text-white">
						
						<Tab eventKey="trades" title="Trades" className="bg-dark">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Time</th>
										<th>DAPP</th>
										<th>DAPP/ETH</th>
									</tr>
								</thead>

							</table>
						</Tab>

						<Tab eventKey="orders" title="Orders">
							<table className="table table-dark table-sm small">
								<thead>
									<tr>
										<th>Amount</th>
										<th>DAPP/ETH</th>
										<th>Cancel</th>
									</tr>
								</thead>
							</table>
						</Tab>

					</Tabs>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
	}
}

export default connect(mapStateToProps)(MyTransactions)