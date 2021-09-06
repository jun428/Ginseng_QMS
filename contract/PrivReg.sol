// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract PrivReg{


    address whoami;
    
    event successLog(
        uint time,
        string name,
        string birthday,
        string addr,
        string phone,
        address whoami
    );
        
    modifier check{
        require(whoami==msg.sender,"test check");
        _;
    }

    constructor(
        string memory _name,
        string memory _birthday,
        string memory _addr,
        string memory _phone
        ){
            whoami=msg.sender;
            emit successLog(block.timestamp,_name,_birthday,_addr,_phone,msg.sender);
    }
    
    function modifyData(
        string memory _name,
        string memory _birthday,
        string memory _addr,
        string memory _phone
        ) check public{
            emit successLog(block.timestamp,_name,_birthday,_addr,_phone,msg.sender);
    }
}
