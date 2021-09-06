// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Record{

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


    event history(
        uint time,
        address whoami,
        string title,
        string conent
    );


    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    function record(
        string memory _title,
        string memory _conent) adminCheck public{
            emit history(
                block.timestamp,
                msg.sender,
                _title,
                _conent);
        }

}
