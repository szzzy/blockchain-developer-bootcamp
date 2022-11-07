# blockchain-developer-bootcamp

一个blockchain开发的小demo dapp，只能说是体验一下dapp的开发流程



整个教程solidity合约编写的部分很少，感觉更像一个react前端教程（

总之不推荐，视频太久远了，坑很多。



整了很久，dapp本地是实现了，但是最后部署到goerli测试网上的部分寄了

最后部署的时候，在truffle-config.js报错：`Error: Could not create addresses from your mnemonic or private key(s). Please check that your inputs are correct.`

```js
    goerli: {
      provider: function() {
        return new HDWalletProvider({
          //Private Key
          privateKeys: privateKeys, //array of account private keys
          providerOrUrl: `https://goerli.infura.io/v3/${infuraApiKey}`  //Url to Etherum Node
        })
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 5,
    },
```

我感觉代码没有问题，估计是包之间依赖版本的问题，懒得弄了



断断续续写了两个月左右，打算到这里就结束了，不更新了



视频教程：[区块链开发训练营(从0教你开发dapp)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV153411N7to/?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click&vd_source=a4188fa41affd328ccd5e9743098a6e0)

部分参考：[Linhieng/learn-dapp (github.com)](https://github.com/Linhieng/learn-dapp)