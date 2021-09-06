//quorum version
const Web3 = require('web3')
const Web3Quorum = require("web3js-quorum")
const web3 = new Web3Quorum(new Web3('http://localhost:8547'),1337)
const {tessera,besu} = require('./key')

//time
const time = require('./unixTime.js')

const fs = require('fs')
let dataBuffer = fs.readFileSync('./compile/inspection1.abi')
const inspection1 = JSON.parse(dataBuffer);
dataBuffer = fs.readFileSync('./compile/Report.abi')
const Report = JSON.parse(dataBuffer);


exports.getLog =async (CA,topics) =>{

    let data = {
        fromBlock : "latest",
        address : CA,
        topics : [topics]
    }
    let result = await web3.eth.getPastLogs(data)

    try {
        result = (result[result.length-1])
        console.log(result)
        return result
    } catch (error) {
        console.log(error)
        return 0
    }
}

exports.decodeAbi =async (datajson,log) =>{
    let logData = await web3.eth.abi.decodeParameters(datajson,log)
    return logData
}

exports.inspection1Pass = async (CA,pass) =>{


    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(inspection1[4],[pass])


    let funTran = {
        to : CA,
        gas : 3000000,
        gasPrice:0,
        data : funAbiEncod
    }

    let funSignRLP = await web3.eth.accounts.signTransaction(funTran,besu.node1.besu_pri)
    let funTxHash = await web3.eth.sendSignedTransaction(funSignRLP.rawTransaction)

    await console.log(funTxHash)
}

exports.reportPAss = async (CA,pass) =>{


    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(Report[4],[pass])


    let funTran = {
        to : CA,
        gas : 3000000,
        gasPrice:0,
        data : funAbiEncod
    }

    let funSignRLP = await web3.eth.accounts.signTransaction(funTran,besu.node1.besu_pri)
    let funTxHash = await web3.eth.sendSignedTransaction(funSignRLP.rawTransaction)

    await console.log(funTxHash)
}


//this.getLog('0x676570f285570b7eab8c9f716fded1cb936325ce','0x1a6d1e5649258aafd7adeca8a2f09bd1a3889c04f75701860f7eb261d57da7e3')
//this.inspection1Pass("0x676570f285570b7eab8c9f716fded1cb936325ce",true)
//this.inspection1Pass("0x676570f285570b7eab8c9f716fded1cb936325ce",false)

this.getLog('0xA9d141470bd0b6D4605Cc670BE678A0a6d279483',null)
