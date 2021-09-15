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


console.log(Report)


exports.getResult=async (CA,sha3) =>{
    //resultEvnt = 'result(bool,uint256,address,address)'
    topic=web3.utils.sha3(resultEvnt)

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
