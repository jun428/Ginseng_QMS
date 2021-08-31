// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.6;

contract priv{

    struct info{
        string name;
        string birthday;
        string addr;
        string phone;
        address whoami;
    }
    info _info;
    address payable admin;

    constructor(){
        admin=msg.sender;
    }

    function register(
        string memory _name,
        string memory _birthday,
        string memory _addr,
        string memory _phone
        ) public {
            require(_info.whoami!=msg.sender);
            _info.name=_name;
            _info.birthday=_birthday;
            _info.addr=_addr;
            _info.phone=_phone;
            _info.whoami=msg.sender;
    }

    function call() view public returns(string memory, string memory, string memory, string memory,address){
            return (_info.name, _info.birthday, _info.addr, _info.phone,_info.whoami);
    }

    function remove()  public{
        selfdestruct(admin);
    }
}
