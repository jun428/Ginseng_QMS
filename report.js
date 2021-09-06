//quorum version
const Web3 = require('web3')
const Web3Quorum = require("web3js-quorum")
const web3 = new Web3Quorum(new Web3('http://localhost:8547'),1337)
const {tessera,besu} = require('./key')

const time = require('./unixTime.js')


const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/Report.abi')
const dataJSON = JSON.parse(dataBuffer);

//bin
const binBuffer = fs.readFileSync('./compile/Report.bin')
const binData = binBuffer.toString()


exports.deploy =async (parm,besuPrivKey) =>{


    let abiEncod = await web3.eth.abi.encodeParameter('address',parm[0])

    let tran = {
        gas : 3000000,
        gasPrice:0,
        data : '0x'+binData+abiEncod.substring(2)
    }

    //admin sgin
    let signRLP = await web3.eth.accounts.signTransaction(tran,besu.node1.besu_pri)
    let txHash = await web3.eth.sendSignedTransaction(signRLP.rawTransaction)

    let funAbiEncod = await web3.eth.abi.encodeFunctionCall(dataJSON[5],parm)


    let funTran = {
        to : txHash.contractAddress,
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
        topics : ['0xf9c7c94ec29a5e0a317ff6d6cac4694ee5d9da32f16903499611ad5dc92750e5']
    }


    let result = await web3.eth.getPastLogs(data)

    try {
        result = result[result.length-1]
    } catch (error) {
        console.log("inspection1 getLog try catch\n")
        console.log(error)
    }

    //log data
    let logData = await web3.eth.abi.decodeParameters(dataJSON[3].inputs,result.data)


    console.log("inspection1 : getLog\n")
    console.log(logData)
    let getTime = time.unix_timestamp(logData.time)
    return {
        logData,
        getTime,
        CA
    }
}
