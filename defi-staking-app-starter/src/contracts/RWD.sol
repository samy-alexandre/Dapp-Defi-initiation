pragma solidity ^0.5.0;

contract RWD {
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint256 public totalSupply = 1000000000000000000000000; // 1 Millions tokens
    uint8 public decimals = 18;

    event Transfert(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    //
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfert(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Require that the value is greater or equal for transfert
        require(balanceOf[msg.sender] >= _value);

        // Transfert the amount and substract the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Run transfert
        emit Transfert(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfertFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfert(_from, _to, _value);
        return true;
    }
}
