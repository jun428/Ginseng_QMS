const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const privTran = require('./privTran.js')
const pubTran = require('./publicTran.js')



const PassTran = require('./PassTran.js') 

const privReg = require('./privReg.js') 
const inspection1 = require('./inspection1.js') 
const report = require('./report.js')
const record = require('./record.js')
const inspection2 = require('./inspection2.js') 
const allCheck = require('./allCheck.js') 
const myKey = fs.readFileSync("privateKey.pem", "utf8")

//inspection1
let dataBuffer = fs.readFileSync('./compile/inspection1.abi')
const inspection1ABI = JSON.parse(dataBuffer);
dataBuffer = fs.readFileSync('./compile/Report.abi')
const ReportABI = JSON.parse(dataBuffer);
dataBuffer = fs.readFileSync('./compile/Record.abi')
const RecordABI = JSON.parse(dataBuffer);
 dataBuffer = fs.readFileSync('./compile/inspection2.abi')
const inspection2ABI = JSON.parse(dataBuffer);

const GroupAddr = 'x7DX+1S9cA/FMZxwJlyMSrP6rUSgBXAuJZCuAHcMZAE='
const node3tessera = '+QytC8W6NKxrh8E6+vJrblFUHdLFPy4m79sJfH8lels='

const app = express()

app.use(express.urlencoded({extended: true}))

//app.use(bodyParser)
app.set('views',__dirname+'/view')
app.set('view engine','ejs')

app.get('/meta', (req, res) => {
    res.render('meta.ejs')
})

//index page
app.get('/', (req, res) => {
    res.render('index.ejs')
})

//private register
app.get('/privReg', (req, res) => {
    res.render('privReg.ejs')
})

app.post('/privReg', (req, res) => {
    var besuPrivKey = req.body.besuPrivKey
    var tesseraPubKey = node3tessera
    var name = req.body.name
    var brithday = req.body.brithday
    var address = req.body.address
    var phone = req.body.phone

    const parm =[name,brithday,address,phone]
    console.log(parm)


    privReg.deployReg(besuPrivKey,tesseraPubKey,parm).then(result =>{
        //res.send(result)

        privReg.getLog(
            result.privacyGroupId,
            result.contractAddress
        ).then(result =>{
            //cookies
            //res.cookie('privateAddr',result.CA)
            //res.cookie('GroupID',result.GroupID)

            res.render('privRegReult.ejs',
            {'Name' : result.log.name,
            'Brithday' : result.log.birthday,
            'Address' : result.log.addr,
            'phone' : result.log.phone,
            'whoami' : result.log.from,
            'privateAddr' : result.CA
        })
        })

    })
})


//Application
app.get('/inspection1', (req, res) => {
    res.render('inspection1.ejs')
})

app.post('/inspection1', (req, res) => {
    var PrivCA = req.body.PrivCA
    var besuPrivKey = req.body.besuPrivKey
    var ProdutionAddr = req.body.ProdutionAddr
    var TotalArea = req.body.TotalArea
    var UsedArea = req.body.UsedArea
    var PlantDate = req.body.PlantDate

    //temp code
    let parm = [PrivCA,ProdutionAddr,TotalArea,UsedArea,PlantDate]
    inspection1.deploy(parm,besuPrivKey).then(result =>{
        inspection1.getLog(result.to).then(result =>{

            res.render('inspection1Reult.ejs',{
                'whoami':result.logData.whoami,
                'privCA' : result.logData.privCA,
                'CA' : result.CA,
                'getTime' : result.getTime,
                'produtionAddr' : result.logData.produtionAddr,
                'totalArea' : result.logData.totalArea,
                'usedArea' : result.logData.usedArea,
                'plantingDate' : result.logData.plantingDate
            }
            )
        })
    })
})


app.get('/report', (req, res) => {
    res.render('report.ejs')
})

app.post('/report',async (req, res) => {
    var preCA = req.body.preCA
    var besuPrivKey = req.body.besuPrivKey
    var plantingDate = req.body.plantingDate
    var estimatedYear = req.body.estimatedYear
    var select = req.body.select

    let parm = [preCA,plantingDate,estimatedYear,select]


    //inspection1 pass log hash
    let result = await PassTran.getLog(preCA, '0x1a6d1e5649258aafd7adeca8a2f09bd1a3889c04f75701860f7eb261d57da7e3')
    if(result!=undefined){
        result = await PassTran.decodeAbi(inspection1ABI[4].inputs,result.data)
        console.log(result)
        if(result._pass){
            result = await report.deploy(parm,besuPrivKey)
            result = await report.getLog(result.to)
            
            //deploy record
            let recordCA = await record.deploy(result.CA)


            res.render('reportResult.ejs',{
                'whoami':result.logData.whoami,
                'previousCA' : result.logData.previousCA,
                'CA' : result.CA,
                'recordCA' : recordCA.contractAddress,
                'getTime' : result.getTime,
                'plantingDate' : result.logData.plantingDate,
                'estimatedYear' : result.logData.estimatedYear,
                'select' : result.logData.select,
            })
            //console.log(result)
        }
        else {
            console.log("inspection1 not pass\n")
            res.render('reportFail.ejs')
        }
    }
    else res.render('reportFail.ejs')

})


app.get('/record', (req, res) => {
    res.render('record.ejs')
})

app.post('/record', async (req, res) => {
    var recordCA = req.body.recordCA
    var besuPrivKey = req.body.besuPrivKey
    var Title = req.body.Title
    var content = req.body.content

    parm=[Title,content]

    //record event preCA
    resultEvnt = 'result(bool,uint256,address,address)'
    let topic = await PassTran.sha3(resultEvnt)
    let addrTopic = await PassTran.sha3('previous(address)')


    let preaddr = await PassTran.getResult(recordCA, addrTopic)
    if(preaddr!=undefined){
        reportAddr = await PassTran.decodeAbi(RecordABI[2].inputs,preaddr.data)
        preaddr = await PassTran.getResult(reportAddr.previousCA,topic)
       
        if(preaddr!=undefined){
            //Report result event
            passResult = await PassTran.decodeAbi(ReportABI[2].inputs,preaddr.data)
            console.log(passResult)
            if(passResult.pass){


                result = await record.logRecord(recordCA,besuPrivKey,parm)
                result = await record.getLog(result.to)

                res.render('recordResult.ejs',{
                    'time':result.getTime,
                    'address' : result.CA,
                    'title' : result.logData.title,
                    'content' : result.logData.content
                })
                    
            }else res.render('recordFail.ejs')

        }else res.render('recordFail.ejs')
    }else res.render('recordFail.ejs')
})


app.get('/inspection2', (req, res) => {
    res.render('inspection2.ejs')
})

app.post('/inspection2', async (req, res) => {

    var preCA = req.body.preCA
    var besuPrivKey = req.body.besuPrivKey
    var productionAddr = req.body.productionAddr
    var productionArea = req.body.productionArea
    var expected = req.body.expected

    let parm = [preCA,productionAddr,productionArea,expected]
    
    resultEvnt = 'result(bool,uint256,address,address)'
    topic = PassTran.sha3(resultEvnt)

    //inspection1 pass log hash
    let result = await PassTran.getLog(preCA, topic)
    if(result!=undefined){
        result = await PassTran.decodeAbi(RecordABI[3].inputs,result.data)
        console.log(result)
        if(result.pass){
            result = await inspection2.deploy(parm,besuPrivKey)
            result = await inspection2.getLog(result.to)
            
            //deploy record
            
            console.log(result)

            
            res.render('inspection2Reuslt.ejs',{
                'whoami':result.logData.whoami,
                'previousCA' : result.logData.privCA,
                'CA' : result.CA,
                'getTime' : result.getTime,
                'produtionAddr' : result.logData.produtionAddr,
                'produtionArea' : result.logData.produtionArea,
                'expected' : result.logData.expected,
            })
            
        }
        else {
            console.log("inspection2 not pass\n")
            res.render('inspection2Fail.ejs')
        }
    }
    else res.render('inspection2Fail.ejs')
})

app.get('/result', (req, res) => {
    res.render('result.ejs')
})

app.post('/result', async (req, res) => {

    try {
        var addr = req.body.addr
        var inspection2 = await allCheck.topic(addr,1)
        var inspection2Pass = await allCheck.decodeAbi(inspection2,1)

        console.log(inspection2Pass)
        if(inspection2Pass.pass){


            var record = await allCheck.topic(addr,0)
            record = await allCheck.decodeAbi(record,0)


            var report = await allCheck.topic(record[0],0)
            report = await allCheck.decodeAbi(report,0)


            var inspection1 = await allCheck.topic(report[0],0)
            inspection1 = await allCheck.decodeAbi(inspection1,0)


            var private = await allCheck.topic(inspection1[0],0)
            private = await allCheck.decodeAbi(private,0)

            res.render('resultResult.ejs',{
                'Private': private[0],
                'inspection1' : inspection1[0],
                'Report' : report[0],
                'Record' : record[0],
                'inspection2' : addr
            })
        }else res.render('resultFail.ejs')
    } catch (error) {
        res.render('resultFail.ejs')
    }
})

app.get('/query', async (req, res) => {
    var addr = req.query.Address
    var no = req.query.No

    if(no==0){
        res.render('Auth.ejs',{
            'address' : addr})

    }
    else if(no==1){

        var result = await inspection1.getLog(addr)
        res.render('inspection1Reult.ejs',{
            'whoami':result.logData.whoami,
            'privCA' : result.logData.privCA,
            'CA' : result.CA,
            'getTime' : result.getTime,
            'produtionAddr' : result.logData.produtionAddr,
            'totalArea' : result.logData.totalArea,
            'usedArea' : result.logData.usedArea,
            'plantingDate' : result.logData.plantingDate
        })
    }else if(no==2){

        var result = await report.getLog(addr)
        res.render('reportResult.ejs',{
            'whoami':result.logData.whoami,
            'previousCA' : result.logData.previousCA,
            'CA' : result.CA,
            'recordCA' : "",
            'getTime' : result.getTime,
            'plantingDate' : result.logData.plantingDate,
            'estimatedYear' : result.logData.estimatedYear,
            'select' : result.logData.select,
        })

    }else if(no==3){

        var result = await record.getLog(addr)
        res.render('recordResult.ejs',{
            'time':result.getTime,
            'address' : result.CA,
            'title' : result.logData.title,
            'content' : result.logData.content
        })
        
    }else if(no==4){
        result = await inspection2.getLog(addr)
                    
        res.render('inspection2Reuslt.ejs',{
            'whoami':result.logData.whoami,
            'previousCA' : result.logData.privCA,
            'CA' : result.CA,
            'getTime' : result.getTime,
            'produtionAddr' : result.logData.produtionAddr,
            'produtionArea' : result.logData.produtionArea,
            'expected' : result.logData.expected,
        })
        
    }
    //res.render('result.ejs')
})


/*
app.get('/Auth', (req, res) => {
    res.render('Auth.ejs')
})

app.post('/Auth', (req, res) => {
    const pubKey = req.body.Tessera

    const token = jwt.sign({
        "permissions": ["*:*"],
        "username": "user2",
        "privacyPublicKey": pubKey
      },myKey,
      {expiresIn: '1h', algorithm: 'RS256'})

      res.cookie('token',token)
      
      res.redirect('/')
    
    
    //pubTran.deploy(pubKey).then(result =>{
    //    res.send(result)
    //})
    
     
})
*/

//auth test
app.get('/Auth', (req, res) => {
    res.render('Auth.ejs')
})

app.post('/Auth', async (req, res) => {
    try {
        const key = req.body.Besu
        const addr = req.body.addr
    
        var result = await pubTran.deploy(key)
        var getLog = await privReg.getLog(GroupAddr,addr)

        console.log("From address : ",result.from)
        console.log("Log address : ",getLog.log.from)
        //a comparison address
        comparison1 = Number(result.from)
        comparison2 = Number(getLog.log.from)


        //console.log(comparison1,comparison2)
    
        if(comparison1==comparison2){
            console.log("Success")
            res.render('privRegReult.ejs',
                {'Name' : getLog.log.name,
                'Brithday' : getLog.log.birthday,
                'Address' : getLog.log.addr,
                'phone' : getLog.log.phone,
                'whoami' : getLog.log.from,
                'privateAddr' : getLog.CA
            })
        }
        else{
            console.log("Fail")
            res.render('AuthFail.ejs')
        } 
        
    } catch (error) {
        res.render('AuthFail.ejs')        
    }



    /*
    privTran.view(groupID,CA).then(result =>{
        res.send(result)
    })
    */
})

app.get('/view', (req, res) => {
    res.render('view.ejs')
})

app.post('/view', async (req, res) => {
    const groupID = req.body.groupID
    const CA = req.body.CA

    privTran.view(groupID,CA)
})

/*
app.get('/privDeploy', (req, res) => {
    res.render('privDeploy.ejs')
})

app.post('/privDeploy', (req, res) => {

    const tesseraPubKey = req.body.tesseraPubKey

    console.log(tesseraPubKey)

    
    privTran.deploy(tesseraPubKey).then(result =>{
        res.send(result)
    })

})
*/

//Application


app.get('/result', (req, res) => {
    res.render('result.ejs')
})

app.post('/result', (req, res) => {

})

app.listen(3000, () =>{
    console.log("sever star")
})
