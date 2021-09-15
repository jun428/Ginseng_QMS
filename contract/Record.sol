// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Record{

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


    event result(
        bool pass,
        uint time,
        address preCA,
        address admin
    );

    event history(
        uint time,
        address whoami,
        string title,
        string content
    );


    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    function record(
        string memory _title,
        string memory _content) public{
            emit history(
                block.timestamp,
                msg.sender,
                _title,
                _content);
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
