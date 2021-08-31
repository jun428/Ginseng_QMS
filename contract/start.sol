// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.6;

contract reg{

    struct info{
        uint regTime;
        uint finishTime;
        string produtioncAddr;
        uint totalArea;
        uint usedArea;
        string plantingDay;
        address privateInfo;
        address nextStep;
    }
    
    address admin;
    uint index;

    mapping(uint => info) _info;
    mapping(address => bool) farmer;
    mapping(address => uint) infoIndex;

    constructor(){
        admin=msg.sender;
        index=1;
    }

    modifier adminCheck(){
        require(msg.sender==admin);
        _;
    }
    
    modifier farmerCheck(address addr){
        require(farmer[addr]==true);
        _;
    }

    function request(
        string memory _produtioncAddr, 
        uint _totalArea, 
        uint _usedArea, 
        string memory _plantingDay,
        address _privateInfo,
        address _nextStep) public farmerCheck(msg.sender) {

        infoIndex[_privateInfo]=index;

        _info[index].regTime = block.timestamp;
        _info[index].produtioncAddr = _produtioncAddr;
        _info[index].totalArea = _totalArea;
        _info[index].usedArea = _usedArea;
        _info[index].plantingDay = _plantingDay;
        _info[index].privateInfo = _privateInfo;
        _info[index].nextStep = _nextStep;
        index++;
    }

    function finishTimeUpdate(address addr) public adminCheck{
        _info[infoIndex[addr]].finishTime=block.timestamp;
    }

    function addFarmer(address addr) public adminCheck{
        farmer[addr]=true;
    }

    function removeFarmer(address addr) public adminCheck{
        farmer[addr]=false;
    }

    function auth(address addr) view public returns(bool){
        return farmer[addr];
    }

    function infoView(address addr) view public returns(bool,uint, uint, string memory, uint, uint, string memory, address) {
        uint temp = infoIndex[addr];
        return (farmer[addr], _info[temp].regTime, _info[temp].finishTime,_info[temp].produtioncAddr, _info[temp].totalArea, _info[temp].usedArea, _info[temp].plantingDay, _info[temp].privateInfo);
    }
}
