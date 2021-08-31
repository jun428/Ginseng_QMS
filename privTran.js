var web3 = require('web3')
var {tessera,besu} = require('./key')
var web3 = new web3('http://localhost:8545')
const EEAClient = require("web3-eea")

//abi
const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/priv.abi')
const dataJSON = JSON.parse(dataBuffer);

const binBuffer = fs.readFileSync('./compile/priv.bin')
const binData = binBuffer.toString()

web3 = new EEAClient(web3,1337)

//----------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.deploy =async (tesseraPubKey) =>{

    const solBin = binData
    //get group ID
    const group = {
        addresses: [tessera.node1.tessera_pub,tessera.node2.tessera_pub,tesseraPubKey],
        name: 'group1',
        description: "test"
    };
    var groupId = await web3.priv.findPrivacyGroup({addresses : group.addresses})
    if(groupId[0]==undefined){
        groupId = await web3.priv.createPrivacyGroup(group)
    }else{
        groupId =groupId[0].privacyGroupId
    }
    console.log("groupId : " + groupId)

    const tran = {
        privateKey : besu.node1.besu_pri.split('x')[1],  //no need 0x
        privateFrom : tessera.node1.tessera_pub,
        privacyGroupId : groupId,
        data : "0x"+solBin,  // need "0x" 
        //gas : 2000000
    }

    const txHash = await web3.eea.sendRawTransaction(tran)
    const receipt = await web3.priv.getTransactionReceipt(txHash)

    return {
        CA : receipt.contractAddress,
        groupId : groupId
    }
}
/*
const test = this.deploy(tessera.node3.tessera_pub)
test.then(result => {
    console.log("groupId : "+result.groupId)
    console.log("CA : "+result.CA)
})
*/
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.regFunc = async ( besuPrivKey, tesseraPubKey, groupId,contractAddr, parmArr) => {

    abiParm = web3.eth.abi.encodeFunctionCall(dataJSON[3],parmArr)//defualt abi

    const tran = {
        privateFrom : tesseraPubKey,
        privateFor : groupId,
        //privacyGroupId : groupId,
        to : contractAddr,
        data : parmArr,  // need "0x" 
        gas : 2000000
    }
    console.log(tran)
    web3.eth.accounts.signTransaction(tran,besuPrivKey).then(console.log)

    const txHash = await web3.eea.sendRawTransaction(tran)
    const receipt = await web3.priv.getTransactionReceipt(txHash)
    
    return receipt
}
/*
const grpId = 'KvmQT6/dS066n6lanL2N5t7KagoGzk8/YlOOVU2/LdU='
const CA = '0x59db2035f9594d1861156b5b68b97dc93c9444f0'
const parm = ['jun','960428','Korea brbrbrbrb 751-2','010123456789']

const test = this.regFunc(besu.node3.besu_pri, tessera.node3.tessera_pub, grpId, CA, parm)
test.then(console.log)
*/
//this.regFunc(besu.node3.besu_pri,'3nOqexhTLz7vHUERLbiMbGRqOu6pFhqoCRtdYSwZfEc=',[tessera.node2.tessera_pub],besu.node2.address,'0x1234').then(console.log)
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.deployReg =async (besuPrivKey, tesseraPubKey, parm) =>{

    const solBin = binData//compile bin

    //get group ID
    const group = {
        addresses: [tessera.node1.tessera_pub,tessera.node2.tessera_pub,tesseraPubKey],
        name: 'group1',
        description: "test"
    };

    var groupId =await web3.priv.findPrivacyGroup({addresses : group.addresses})
    if(groupId[0]==undefined){
        groupId = await web3.priv.createPrivacyGroup(group)
    }else{
        groupId =groupId[0].privacyGroupId
    }
    const deployTran = {
        privateKey : besu.node1.besu_pri.split('x')[1],  //no need 0x
        privateFrom : tessera.node1.tessera_pub,
        privacyGroupId : groupId,
        data : "0x"+solBin,  // need "0x" 
        //gas : 2000000
    }

    const txHash_1 = await web3.eea.sendRawTransaction(deployTran)
    const receipt_1 = await web3.priv.getTransactionReceipt(txHash_1)

    web3.setProvider('http://localhost:8547')//node3 port
    const abiParm = web3.eth.abi.encodeFunctionCall(dataJSON[2],parm)//compile abi
    
    const regTran = {
        privateKey : besuPrivKey.split('x')[1],  //no need 0x
        privateFrom : tesseraPubKey,
        privacyGroupId : groupId, 
        to : receipt_1.contractAddress,//CA address
        data : abiParm,  // need "0x" 
        //gas : 2000000
    }

    const txHash_2 = await web3.eea.sendRawTransaction(regTran)
    const receipt_2 = await web3.priv.getTransactionReceipt(txHash_2)

    web3.setProvider('http://localhost:8545')//return

    return {
        CA : receipt_1.contractAddress,
        groupId : groupId,
        receipt : receipt_2
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.view = async (groupId, contractAddr) => {
    const abiParm = web3.eth.abi.encodeFunctionCall(dataJSON[1],[])

    const tran = {
        privacyGroupId : groupId,
        to : contractAddr,
        data : abiParm        
    }

    const privView = await web3.priv.call(tran)

    return web3.eth.abi.decodeParameters(dataJSON[1].outputs,privView)
}

//view(grpId,CA,dataJSON[1])