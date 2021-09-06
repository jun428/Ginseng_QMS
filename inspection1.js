//quorum version
const Web3 = require('web3')
const Web3Quorum = require("web3js-quorum")
const web3 = new Web3Quorum(new Web3('http://localhost:8547'),1337)
const {tessera,besu} = require('./key')

const time = require('./unixTime.js')


const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/inspection1.abi')
const dataJSON = JSON.parse(dataBuffer);

//bin
const binBuffer = fs.readFileSync('./compile/inspection1.bin')
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
    let funSignRLP = await web3.eth.accounts.signTransaction(funTran,besuPrivKey)

    let funTxHash = await web3.eth.sendSignedTransaction(funSignRLP.rawTransaction)


    console.log("inspection1 : deploy\n")
    console.log(funTxHash)
    return funTxHash


 }


 //front return 
 exports.getLog =async (CA) =>{

    let data = {
        address : CA,
        topics : ['0xa7f1c7dab6b5bfcfe8dabaad74604ae7506086c199ab1265ae1594c283f478b9']
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

 exports.PassLog =async (CA) =>{

    let data = {
        address : CA
    }


    let result = await web3.eth.getPastLogs(data)

    //log data
    console.log(result)
    let logData = await web3.eth.abi.decodeParameters(dataJSON[3].inputs,result[1].data)

    let getTime = time.unix_timestamp(logData.time)
    return {
        logData,
        getTime,
        CA
    }


 }

/*
console.log(dataJSON[1].inputs)
this.getLog("x7DX+1S9cA/FMZxwJlyMSrP6rUSgBXAuJZCuAHcMZAE=","0x355152aB610Cb71E40510351866f4F93A8aD224c").then(result =>{
    //console.log(result[0].data)
    let data = web3.eth.abi.decodeParameters(dataJSON[1].inputs,result[0].data)
    console.log(data)
    console.log(time.unix_timestamp(data.time))
})
*/
//let result = web3.eth.abi.decodeParameters(dataJSON[1].inputs,data)
