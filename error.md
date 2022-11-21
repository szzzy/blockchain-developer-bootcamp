## 错误汇总

部署到heroku上时，报错`FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`

参考：[node.js - Heroku server crashes with "JavaScript heap out of memory" when deploying 'react-admin' app - Stack Overflow](https://stackoverflow.com/questions/59205530/heroku-server-crashes-with-javascript-heap-out-of-memory-when-deploying-react)

`heroku config:set NODE_OPTIONS='--max_old_space_size=2560 [app-name]'`

`heroku restart`



truffle migrate --network goerli 失败

Migrations" could not deploy due to insufficient funds

虽然部署只花了0.07 eth，但是我账户上0.16 eth也不能部署成功。多加钱就好了。



还有一些别的问题，基本上是依赖包的问题

我这里的package.json到目前为止都能正常运行

