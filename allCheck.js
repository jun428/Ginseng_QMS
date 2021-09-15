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





exports.topic = async (CA,no) =>{

    arr = [web3.utils.sha3('previous(address)'),
    web3.utils.sha3('result(bool,uint256,address,address)')]

    let data = {
        fromBlock : "latest",
        address : CA,
        topics : [arr[no]]
    }
    let result = await web3.eth.getPastLogs(data)


    if(result!=undefined){
        result = result[result.length-1].data
        console.log(result)
    }else{
        
    }

    return result
}

exports.decodeAbi = async (log,no) => {



    arr = [
    [
        {
          indexed: false,
          internalType: 'address',
          name: 'previousCA',
          type: 'address'
        }
      ],
        [
        { indexed: false, internalType: 'bool', name: 'pass', type: 'bool' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'time',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'privCA',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'admin',
          type: 'address'
        }
      ]
]

    let logData = web3.eth.abi.decodeParameters(arr[no],log)
    console.log(logData)
    return logData
}

