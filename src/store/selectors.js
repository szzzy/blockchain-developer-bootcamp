
/*
  选择器
  从redux存储中读取数据
  在mapStateToProps，可以添加选择器，这样可以调用props对应的成员
  如：Navbar.js的 account: accountSelector(state)
  这样可以用{this.props.account}读取数据
*/

import { get } from 'lodash'
import { createSelector } from 'reselect'

const account = state => get(state, 'web3.account')//prevent error
export const accountSelector = createSelector(account, (account) => { return account })//完整写法

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

//const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
export const contractsLoadedSelector = createSelector(
	tokenLoaded,
	exchangeLoaded,
	(tl, el) => (tl && el)
)