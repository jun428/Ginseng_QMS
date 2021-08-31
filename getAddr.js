var web3 = require('web3')
var {tessera,besu} = require('./key')
var web3 = new web3('http://localhost:8545')

console.log(web3.eth.accounts.privateKeyToAccount(besu.node1.besu_pri))
console.log(web3.eth.accounts.privateKeyToAccount(besu.node2.besu_pri));
console.log(web3.eth.accounts.privateKeyToAccount(besu.node3.besu_pri));
console.log(web3.eth.accounts.privateKeyToAccount(besu.node4.besu_pri));
