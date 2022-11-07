require("@babel/register");
require("@babel/polyfill");
require('dotenv').config();
//const HDWalletProvider = require('truffle-hdwallet-provider');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKeys = process.env.PRIVATE_KEYS || ""
const infuraApiKey = process.env.INFURA_API_KEY || ""

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //match any network id
    },
    goerli: {
      //networkCheckTimeout: 60000, // 超过 1min 则提示超时
      provider: () => new HDWalletProvider({
        privateKeys: privateKeys,
        providerOrUrl: "https://goerli.infura.io/v3/${infuraApiKey}"
      }),
        // return new HDWalletProvider(
        //   //Private Key
        //   privateKeys: privateKeys, //array of account private keys
        //   providerOrUrl: `https://goerli.infura.io/v3/${infuraAPIKey}`
        //   //Url to Etherum Node
        // )
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 5,
    },
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
