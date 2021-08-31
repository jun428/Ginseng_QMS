const jwt = require('jsonwebtoken')
const fs = require('fs')

var myKey = fs.readFileSync("privateKey.pem", "utf8")
const token = jwt.sign({
    "permissions": ["*:*"],
    "username": "user2"
  },myKey,{expiresIn: '1h', algorithm: 'RS256'})

  console.log(token)