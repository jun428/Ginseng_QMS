pragma solidity ^0.7.6;

contract examine{
    struct certificate{
        string name;
        uint result;
        bool pass;
    }

    address admin;
    uint8 index;
    uint successNo;
    bool finalResult;
    uint8[] falseIndex = new uint8[](64);
    
    constructor(){
        admin=msg.sender;
        index=1;
        finalResult=false;
        successNo=0;
    }


    mapping(uint => certificate) _certificate;

     modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }

    event falseCheck(string name, uint result, bool pass);
    
    function add(string memory _name, uint _result) public adminCheck{
        require(index<=86);
        if(_result<=10){// *10000
            _certificate[index].pass=true;
            successNo++;
        }else {
            falseIndex.push(index);
            _certificate[index].pass=false;
        }
        _certificate[index].name = _name;
        _certificate[index].result = _result;
        if(index==86 && successNo==86){
            finalResult=true;
        }
        index++;
    }
    
    function insert(uint _index,string memory _name, uint _result) public adminCheck{
        require(_index<index);
        if(_result<=10){// *10000
            _certificate[_index].pass=true;
            successNo++;
        }
        _certificate[_index].name = _name;
        _certificate[_index].result = _result;
    }

    function viewIndex(uint _index) view public returns(string memory,uint, bool){
        return (_certificate[_index].name,_certificate[_index].result,_certificate[_index].pass);
    }

    function viewFalse() view public returns(uint8[] memory){
        return falseIndex;
    }

    function viewRuslt() view public returns(bool){
        return finalResult;
    }
}
