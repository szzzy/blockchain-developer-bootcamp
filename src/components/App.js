import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Token from '../abis/Token.json';

class App extends Component {
  componentWillMount() {
  	this.loadBlockchainData()
  }

  async loadBlockchainData() {
  	const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
  	const network = await web3.eth.net.getNetworkType()
  	const networkId = await web3.eth.net.getId()
  	//console.log('networkId', networkId)
  	const accounts = await web3.eth.getAccounts()
  	try {
      // 请求用户授权
      await window.ethereum.enable();
    } catch (error) {
      // 用户不授权时
      console.error("User denied account access")
    }
    //const abi = Token.abi
    //const networks = Token.networks
    //console.log('abi', Token.abi)
  	//console.log('address', Token.networks[networkId].address)
  	const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
  	const totalSupply = await token.methods.totalSupply().call()
  	console.log('totalSupply', totalSupply)
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


export default App

