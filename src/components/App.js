import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import {connect} from 'react-redux';
import {
	loadWeb3,
	loadAccount,
	loadToken,
	loadExchange
} from '../store/interactions';

class App extends Component {
  componentWillMount() {
  	this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
  	try {
      // 请求用户授权
      await window.ethereum.enable();
    } catch (error) {
      // 用户不授权时
      console.error("User denied account access")
    }

  	const web3 = loadWeb3(dispatch)
  	const network = await web3.eth.net.getNetworkType()
  	const networkId = await web3.eth.net.getId()
  	//console.log('networkId', networkId)
  	const accounts = await loadAccount(web3, dispatch)
    //const abi = Token.abi
    //const networks = Token.networks
    //console.log('abi', Token.abi)
  	//console.log('address', Token.networks[networkId].address)
  	const token = loadToken(web3, networkId, dispatch)
  	loadExchange(web3, networkId, dispatch)
  }

  render() {
    return (
    	<div>
		<nav class="navbar navbar-expand-lg bg-light">
		  <div class="container-fluid">
		    <a class="navbar-brand" href="/#">Navbar</a>
		    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		      <span class="navbar-toggler-icon"></span>
		    </button>
		    <div class="collapse navbar-collapse" id="navbarNav">s
		      <ul class="navbar-nav">
		        <li class="nav-item">
		          <a class="nav-link active" aria-current="page" href="/#">Home</a>
		        </li>
		        <li class="nav-item">
		          <a class="nav-link" href="/#">Features</a>
		        </li>
		        <li class="nav-item">
		          <a class="nav-link" href="/#">Pricing</a>
		        </li>
		        <li class="nav-item">
		          <a class="nav-link disabled" href="/#">Disabled</a>
		        </li>
		      </ul>
		    </div>
		  </div>
		</nav>
      </div>
    )
  }
}


//export default App

//connect App to redux
function mapStateToProps(state) {
	return {

	}
}

export default connect(mapStateToProps)(App)
