// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract inspection1{

    bool pass;
    address admin;
    address privCA;
    
    event successLog(
        uint time,
        address whoami,
        address privCA,
        string produtionAddr,
        string totalArea,
        string usedArea,
        string plantingDate
    );

    event result(
        bool pass,
        uint time,
        address privCA,
        address admin
    );


    event previous(
        address privCA
    );

    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    constructor(
        address _privCA
        ){
            admin=msg.sender;
            privCA=_privCA;
            emit previous(_privCA);
    }


    function signUp(
        address _privCA,
        string memory _produtionAddr,
        string memory _totalArea,
        string memory _usedArea,
        string memory _plantingDate) public{
            require(privCA==_privCA);
            emit successLog(
                block.timestamp,
                msg.sender,
                _privCA,
                _produtionAddr,
                _totalArea,
                _usedArea,
                _plantingDate);

        }

    function Pass(bool _pass) adminCheck public{
        pass=_pass;
        emit result(
            _pass,
            block.timestamp,
            privCA,
            msg.sender
        );
    }

}
