// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract inspection2{

    bool pass;
    address admin;
    address previousCA;
    
    event successLog(
        uint time,
        address whoami,
        address privCA,
        string produtionAddr,
        string produtionArea,
        string expected
    );

    event result(
        bool pass,
        uint time,
        address previousCA,
        address admin
    );


    event previous(
        address previousCA
    );

    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    constructor(
        address _previousCA
        ){
            admin=msg.sender;
            previousCA=_previousCA;
            emit previous(_previousCA);
    }


    function signUp(
        address _previousCA,
        string memory _produtionAddr,
        string memory _produtionArea,
        string memory _expected) public{
            require(previousCA==_previousCA);
            emit successLog(
                block.timestamp,
                msg.sender,
                _previousCA,
                _produtionAddr,
                _produtionArea,
                _expected);

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
