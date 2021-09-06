const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const web3 = new Web3Quorum(new Web3("http://localhost:3000"));
web3.priv.generateAndSendRawTransaction(options);

exports.deploy =async (tesseraPubKey) =>{

    const group = {
        addresses: [tessera.node1.tessera_pub,tessera.node2.tessera_pub,tesseraPubKey],
        name: 'group1',
        description: "test"
    }

    var groupId = await web3.priv.findPrivacyGroup({addresses : group.addresses})
    if(groupId[0]==undefined){
        groupId = await web3.priv.createPrivacyGroup(group)
    }else{
        groupId =groupId[0].privacyGroupId
    }

    //contract inject


}