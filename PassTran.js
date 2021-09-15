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
dataBuffer = fs.readFileSync('./compile/Record.abi')
const Record = JSON.parse(dataBuffer);
dataBuffer = fs.readFileSync('./compile/inspection2.abi')
const inspection2 = JSON.parse(dataBuffer);


exports.sha3=(string) =>{
    topic=web3.utils.sha3(string)
    return topic
}



exports.getResult=async (CA,sha3) =>{
    //resultEvnt = 'result(bool,uint256,address,address)'
    //topic=web3.utils.sha3(resultEvnt)

    let data = {
        fromBlock : "latest",
        address : CA,
        topics : [sha3]
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

//know topics
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

exports.reportPass = async (CA,pass) =>{


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

exports.recordPass = async (CA,pass) =>{


    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(Record[4],[pass])


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

exports.inspection2Pass = async (CA,pass) =>{


    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(inspection2[4],[pass])


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


exports.record = async (CA,pass) =>{


    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(Record[4],[pass])


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


//this.inspection1Pass("0xbfe6e09d4253af0e825da17ec137f0e50392a244",true)
//this.inspection1Pass("0x26abd4eaaf13683948a6291e9535fc98001d11b2",true)


//this.reportPass('0xc362654f1ae7c0829ef1340daf386c1fbfea8e3a',true)

//this.recordPass('0x5519f4f46d77a47466B6f5DDeFb753B11aAbbf81',true)

//this.inspection2Pass("0x94e95300569c3269a89fd0510bd5618c92cb96d6",true)



//this.getLog('0xA9d141470bd0b6D4605Cc670BE678A0a6d279483',null)
