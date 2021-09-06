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
const myKey = fs.readFileSync("privateKey.pem", "utf8")

//inspection1
let dataBuffer = fs.readFileSync('./compile/inspection1.abi')
const inspection1ABI = JSON.parse(dataBuffer);

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
    var tesseraPubKey = req.body.tesseraPubKey
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
            'whoami' : result.log.whoami,
            'privateAddr' : result.CA,
            'GroupID' : result.GroupID
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
        if(result._pass){
            result = await report.deploy(parm,besuPrivKey)
            result = await report.getLog(result.to)
            
            //deploy record
            let recordCA = await record.deploy(result.CA,besuPrivKey)


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
    else res.send('reportFail.ejs')

})


app.get('/record', (req, res) => {
    res.render('record.ejs')
})

app.post('/record', async (req, res) => {
    var recordCA = req.body.recordCA
    var besuPrivKey = req.body.besuPrivKey
    var Title = req.body.Title
    var content = req.body.content

    let parm =[Title,content]

    //record event preCA
    let result = await PassTran.getLog(recordCA, '0x30d28aca2838996f704ec1f0353d61b1f92684901d3e8f08f8bf06997b0f19a9')
    if(result!=undefined){
        result = await PassTran.decodeAbi(inspection1ABI[4].inputs,result.data)
    }

    //let result = await record.logRecord(recordCA,besuPrivKey,parm)
    result

    

})


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
    
      /*
    pubTran.deploy(pubKey).then(result =>{
        res.send(result)
    })
    */
     
})

//auth test
app.get('/test', (req, res) => {
    res.render('test.ejs')
})

app.post('/test', (req, res) => {
    const key = req.body.Besu

    pubTran.deploy(key).then(result => {
        console.log(result.from)
        res.render('test copy.ejs',{'address' : result.from})
    })


    /*
    privTran.view(groupID,CA).then(result =>{
        res.send(result)
    })
    */
})

app.get('/view', (req, res) => {
    res.render('view.ejs')
})

app.post('/view', (req, res) => {
    const groupID = req.body.groupID
    const CA = req.body.CA

    privTran.view(groupID,CA).then(result =>{
        res.send(result)
    })
})

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


//Application

app.get('/insepction2', (req, res) => {
    res.render('inspection2.ejs')
})

app.post('/insepction2', (req, res) => {

})

app.get('/result', (req, res) => {
    res.render('result.ejs')
})

app.post('/result', (req, res) => {

})

app.listen(3000, () =>{
    console.log("sever star")
})
