pragma solidity ^0.5.0;
import "./RWD.sol";
import "./Tether.sol";
import "./Fenda.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;
    Fenda public fenda;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(
        RWD _rwd,
        Tether _tether,
        Fenda _fenda
    ) public {
        rwd = _rwd;
        tether = _tether;
        fenda = _fenda;
        owner = msg.sender;
    }

    //Deposit Tokens Functionality : Staking function

    function depositTokens(uint256 _amount) public {
        //Require Staking amount to be greater than zero
        require(_amount > 0, "Amount cannot be 0");

        // Transfer tether tokens to this contract address for staking
        tether.transfertFrom(msg.sender, address(this), _amount);

        //Update Staking Balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update Staking Balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstake tokens
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];

        // require amount to be grater than zero
        require(balance > 0, "staking balance cannot be less than zero");

        // transfer the tokens to the specified contract address from our bank
        tether.transfert(msg.sender, balance);

        //Update Staking Balance
        stakingBalance[msg.sender] = 0;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update Staking Balance
        isStaking[msg.sender] = false;
    }

    // Issue rewards
    function issueTokens() public {
        //require the owner issue token only

        require(msg.sender == owner, "caller must be the owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient] / 9;

            if (balance > 0) {
                rwd.transfert(recipient, balance);
            }
        }
    }
}
