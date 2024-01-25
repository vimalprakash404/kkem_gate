const jwt = require('jsonwebtoken')


const data =jwt.sign({ "body": "stuff" }, "KKEM")
console.log(data)