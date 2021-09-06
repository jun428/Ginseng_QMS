const Web3 = require('web3')
const Web3Quorum = require("web3js-quorum")
const web3 = new Web3Quorum(new Web3('http://localhost:8547'),1337)
const {tessera,besu} = require('./key')

const time = require('./unixTime.js')


const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/Record.abi')
const dataJSON = JSON.parse(dataBuffer);

//bin
const binBuffer = fs.readFileSync('./compile/Record.bin')
const binData = binBuffer.toString()


exports.deploy =async (preCA,besuPrivKey) =>{

    let abiEncod = await web3.eth.abi.encodeParameter('address',preCA)

    let tran = {
        gas : 3000000,
        gasPrice:0,
        data : '0x'+binData+abiEncod.substring(2)
    }

    //admin sgin
    let signRLP = await web3.eth.accounts.signTransaction(tran,besuPrivKey)
    let txHash = await web3.eth.sendSignedTransaction(signRLP.rawTransaction)

    console.log("record : deploy\n")
    console.log(txHash)
    return txHash
}

exports.logRecord =async (recordCA,besuPrivKey,parm) =>{

    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(dataJSON[3],parm)


    let funTran = {
        to : recordCA,
        gas : 3000000,
        gasPrice:0,
        data : funAbiEncod
    }

    //Producers
    let funSignRLP = await web3.eth.accounts.signTransaction(funTran,besuPrivKey)
    let funTxHash = await web3.eth.sendSignedTransaction(funSignRLP.rawTransaction)

    console.log("report : deploy\n")
    console.log(funTxHash)
    return funTxHash

}


//front return 
exports.getLog =async (CA) =>{

    let data = {
        address : CA,
        topics : []
    }


    let result = await web3.eth.getPastLogs(data)

    try {
        result = result[result.length-1]
    } catch (error) {
        console.log("inspection1 getLog try catch\n")
        console.log(error)
    }

    //log data
    let logData = await web3.eth.abi.decodeParameters(dataJSON[1].inputs,result.data)


    console.log("inspection1 : getLog\n")
    console.log(logData)
    let getTime = time.unix_timestamp(logData.time)
    return {
        logData,
        getTime,
        CA
    }
}