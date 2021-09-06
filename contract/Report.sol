// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Report{

    bool pass;
    address admin;
    address previousCA;


    event previous(
        address previousCA
    );

    constructor(
        address _previousCA
        ){
            admin=msg.sender;
            previousCA=_previousCA;
            emit previous(previousCA);
    }
    
    event successLog(
        uint time,
        address whoami,
        address previousCA,
        string plantingDate,
        string estimatedYear,
        string select
    );

    event result(
        bool pass,
        uint time,
        address preCA,
        address admin
    );



    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    function report(
        address _previousCA,
        string memory _plantingDate,
        string memory _estimatedYear,
        string memory _select) public{
            require(previousCA==_previousCA);
            emit successLog(
                block.timestamp,
                msg.sender,
                _previousCA,
                _plantingDate,
                _estimatedYear,
                _select);
        }

    function Pass(bool _pass) adminCheck public{
        pass=_pass;
        emit result(
            _pass,
            block.timestamp,
            previousCA,
            msg.sender
        );
    }

}
