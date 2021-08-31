var web3 = require('web3')
var {tessera,besu} = require('./key')
var web3 = new web3('http://localhost:8545')
//abi

web3 = new EEAClient(web3,1337)

exports.deploy =async (besuPrivKey) =>{
    var tran = {from:besuPrivKey,}
}