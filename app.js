const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const privTran = require('./privTran.js')
//var myKey = fs.readFileSync("privateKey.pem", "utf8")

const app = express()

app.use(express.urlencoded({extended: true}))

//app.use(bodyParser)
app.set('views',__dirname+'/view')
app.set('view engine','ejs')

app.get('/meta', (req, res) => {
    res.render('meta.ejs')
})

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/privReg', (req, res) => {
    res.render('privReg.ejs')
})

app.post('/privReg', (req, res) => {
    const besuPrivKey = req.body.besuPrivKey
    const tesseraPubKey = req.body.tesseraPubKey
    const name = req.body.name
    const brithday = req.body.brithday
    const address = req.body.address
    const phone = req.body.phone

    const parm =[name,brithday,address,phone]
    console.log(parm)
    privTran.deployReg(besuPrivKey,tesseraPubKey,parm).then(result =>{
        res.send(result)
    })
})

app.get('/Auth', (req, res) => {
    res.render('Auth.ejs')
})

app.post('/Auth', (req, res) => {
    const pubKey = req.body.key

    const token = jwt.sign({
        "permissions": ["*:*"],
        "username": "user2",
        "privacyPublicKey": pubKey
      },myKey,
      {expiresIn: '1h', algorithm: 'RS256'})

      res.cookie('token',token)
      res.redirect('/')
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

app.get('/record', (req, res) => {
    res.render('record.ejs')
})

app.post('/record', (req, res) => {
    

})

app.listen(3000, () =>{
    console.log("sever star")
})
