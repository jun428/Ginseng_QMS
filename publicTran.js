var Web3 = require('web3')
var {tessera,besu} = require('./key')
var web3 = new Web3('http://localhost:8545')
//abi
const fs = require('fs')
const dataBuffer = fs.readFileSync('./compile/priv.abi')
const dataJSON = JSON.parse(dataBuffer);

const binBuffer = fs.readFileSync('./compile/priv.bin')
const binData = binBuffer.toString()



exports.deploy =async (besuPrivKey) =>{


    var tran = {
        gas : 2000000,
        gasPrice:0
    }

    const signRLP = await web3.eth.accounts.signTransaction(tran,besuPrivKey)
    const receipt = await web3.eth.sendSignedTransaction(signRLP.rawTransaction)

    await console.log(receipt)

    return receipt

}

test =async (besuPrivKey) =>{

    var tran = {
        gas : 2000000,
        gasPrice:0,
        data : "0x"+binData
    }
    const signRLP = await web3.eth.accounts.signTransaction(tran,besuPrivKey)
    const receipt = await web3.eth.sendSignedTransaction(signRLP.rawTransaction)
    await console.log(receipt)

}
