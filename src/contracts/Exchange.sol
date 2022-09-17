pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//deposit and withdraw funds
//manage orders - make or cancel
//handle trades - charge fees

//TODO:
//[x] Set the fee account
//[x] Deposit Ether
//[x] Withdraw Ether
//[x] Deposit tokens
//[x] Withdraw tokens
//[x] Check banlances
//[x] Make order
//[x] Cancel order
//[x] Fill order
//[x] Charge fees

contract Exchange {
	using SafeMath for uint;
	//Variables
	address public feeAccount;//the account that receives exchange fee
	uint256 public feePercent;//the fee percentage
	address constant ETHER = address(0); //store Ether in tokens mapping with blank address
	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;
	uint256 public orderCount;
	mapping(uint256 => bool) public orderCancelled;
	mapping(uint256 => bool) public orderFilled;

	//events
	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint256 amount, uint256 balance);
	event Order(
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp
	);
	event Cancel(
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timestamp
	);
	event Trade(
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		address userFill,
		uint256 timestamp
	);

	//a way to model the order
	//a way to store the order
	//add order to storage
	struct _Order {
		uint256 id;
		address user;
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timestamp;
	}


	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint _amount) public {
		require(tokens[ETHER][msg.sender] >= _amount);
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		msg.sender.transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint _amount) public {
		//which token?
		//how much?
		//send tokens to this contract
		//manage deposit - update banlance
		//emit event
		//don't allow Ether deposits
		require(_token != ETHER);
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

	}

	function withdrawToken(address _token, uint _amount) public {
		require(_token != ETHER);
		require(tokens[_token][msg.sender] >= _amount);
		tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
		require(Token(_token).transfer(msg.sender, _amount));
		emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}

	function balanceOf(address _token, address _user) public view returns (uint256) {
		return tokens[_token][_user];
	}

	function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
		orderCount = orderCount.add(1);
		orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
		emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
	}

	function cancelOrder(uint256 _id) public {
		_Order storage _order = orders[_id];//storage means it will fetch it from storage
		require(address(_order.user) == msg.sender);//must be "my" order
		require(_order.id == _id); //the order must exist
		orderCancelled[_id] = true;
		emit Cancel(_order.id, msg.sender, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive, now);
	}

	function fillOrder(uint256 _id) public {
		//fetch the orderex
		//execute trade
		//mark order as filled
		require(_id >= 0 && _id <= orderCount);
		require(!orderFilled[_id]);
		require(!orderCancelled[_id]);
		_Order storage _order = orders[_id];
		_trade(_order.id, _order.user, _order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
		orderFilled[_order.id] = true;
	}

	function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
		//fee paid by the user who fills the order, a.k.a. msg.sender
		//fee deducted from _amountGet
		//uint256 _feeAmount = _amountGive.mul(feePercent).div(100);// it's original code but why (_amountGive)??? I think it should be _amountGet
		uint256 _feeAmount = _amountGet.mul(feePercent).div(100);

		//execute trade
		//charge fees
		//emit trade event
		tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount));
		tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);

		tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount);
		
		tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
		tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);

		emit Trade(_orderId, _user, _tokenGet, _amountGet, _tokenGive, _amountGive, msg.sender, now);

	}

	//Fallback: reverts if ether is sent to this smart contract by mistake
	function() external {
		revert();
	}
}