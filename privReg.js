 //quorum version
const Web3 = require('web3')
const Web3Quorum = require("web3js-quorum")
const web3 = new Web3Quorum(new Web3('http://localhost:8547'),1337)
const {tessera,besu} = require('./key')


//eea version
/*
var web3 = require('web3')
var {tessera,besu} = require('./key')
var web3 = new web3('http://localhost:8547')
const EEAClient = require("web3-eea")
web3 = new EEAClient(web3,1337)
*/

//abi
const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/PrivReg.abi')
const dataJSON = JSON.parse(dataBuffer);

//bin
const binBuffer = fs.readFileSync('./compile/PrivReg.bin')
const binData = binBuffer.toString()


//----------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.deployReg =async (besuPrivKey, tesseraPubKey, parm) =>{


    //get group ID
    const group = {
        addresses: [tessera.node1.tessera_pub,tessera.node2.tessera_pub,tesseraPubKey],
        name: parm._name+'(group)',
        description: "group create"
    };

    //quorum
    let groupId =await web3.priv.findPrivacyGroup(group.addresses)
    
    //eea version
    //let groupId = await web3.priv.findPrivacyGroup({addresses : group.addresses})
    console.log(groupId)
    if(groupId[0]==undefined){
        groupId = await web3.priv.createPrivacyGroup(group)
    }else{
        groupId =groupId[0].privacyGroupId
    }

      
    //let abiSha3 = web3.eth.abi.encodeFunctionCall(dataJSON[0],parm)
    let abiSha3 = web3.eth.abi.encodeParameters(
        ['string','string','string','string'],
        parm
        )
    

    const deployTran = {
        privateKey : besuPrivKey.substring(2),
        privateFrom : tesseraPubKey,
        //privateFor : [tessera.node1.tessera_pub],
        privacyGroupId : groupId,
        data : "0x"+binData+abiSha3.substring(2),
        //data : "0x"+solBin,  // need "0x" 
    }
    //check

    //const txHash = await web3.eea.sendRawTransaction(deployTran)
    //const receipt = await web3.priv.getTransactionReceipt(txHash)
    //quorum
    const txHash = await web3.priv.generateAndSendRawTransaction(deployTran)
    const receipt = await web3.priv.waitForTransactionReceipt(txHash)
    

    console.log("Tx hash : "+txHash)
    console.log(receipt)


    return receipt

}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.call =async (privacyGroupId, contractAddress, besuPrivKey, tesseraPubKey) =>{


    //web3.eth.abi.encodeFunctionSignature(dataJSON[2])
    let abiSha3 = web3.eth.abi.encodeFunctionCall(dataJSON[2],[])

    let data = {
        to : contractAddress,
        data : abiSha3
    }

    console.log(data)
    let bindata  = await web3.priv.call(privacyGroupId,data)
    let result = web3.eth.abi.decodeParameters(
        ['string','string','string','string','address'],
        bindata
    )

    console.log(result)
    return result
    
}