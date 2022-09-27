import React, { Component } from 'react'
import { connect } from 'react-redux'

class Content extends Component {
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

				<div className="vertical">
					<div className="card bg-dark text-white">
						<div className="card-header">
							card title3
						</div>
						<div className="card-body">
							<p className="card-text">some content3</p>
							<a href="/#" className="card-link">card-link3</a>
						</div>
					</div>
				</div>

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

				<div className="vertical">
					<div className="card bg-dark text-white">
						<div className="card-header">
							card title6
						</div>
						<div className="card-body">
							<p className="card-text">some content6</p>
							<a href="/#" className="card-link">card-link6</a>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps)(Content)