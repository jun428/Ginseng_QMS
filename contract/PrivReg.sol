// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract PrivReg{

    struct info{
        string name;
        string birthday;
        string addr;
        string phone;
        address whoami;
    }
    info _info;
    
    event successLog(
        string name,
        string birthday,
        string addr,
        string phone,
        address whoami
    );
        
    modifier check{
        require(_info.whoami==msg.sender,"test check");
        _;
    }

    constructor(
        string memory _name,
        string memory _birthday,
        string memory _addr,
        string memory _phone
        ){
            _info.name=_name;
            _info.birthday=_birthday;
            _info.addr=_addr;
            _info.phone=_phone;
            _info.whoami=msg.sender;
            emit successLog(_name,_birthday,_addr,_phone,msg.sender);
    }
    
    function modifyData(
        string memory _name,
        string memory _birthday,
        string memory _addr,
        string memory _phone
        ) check public{
            _info.name=_name;
            _info.birthday=_birthday;
            _info.addr=_addr;
            _info.phone=_phone;
            _info.whoami=msg.sender;
            emit successLog(_name,_birthday,_addr,_phone,msg.sender);
    }


    function call() view public returns(string memory, string memory, string memory, string memory,address){
            return (_info.name, _info.birthday, _info.addr, _info.phone,_info.whoami);
    }
}
