import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import Content from './Content';
import {connect} from 'react-redux';
import {
	loadWeb3,
	loadAccount,
	loadToken,
	loadExchange
} from '../store/interactions';
import { contractsLoadedSelector } from '../store/selectors';


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
  	console.log(this.props.account)
    return (
    	<div>
			<Navbar />
			<Content />
      	</div>
    )
  }
}


//export default App

//connect App to redux
function mapStateToProps(state) {
	console.log('contractsLoaded ?', contractsLoadedSelector(state))
	return {
		
	}
}

export default connect(mapStateToProps)(App)
