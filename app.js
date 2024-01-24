const express = require('express')
const app = express()
const port = 80
const bodyParser = require("body-parser");
const fs = require("fs")
const jwt = require("jsonwebtoken")
const isAuthenticatetedKKEM = require("./src/middleware/authenticate")
// const { test, form_validator} = require("./src/controllers/kkem")
require("./db/connection")
// app.get('/', (req, res) => res.send('Hello World!'))
// app.get("/secret",isAuthenticatetedKKEM, (req, res) => {
//     return res.status(200).json({"message" : " public message"})
// })

// app.get("/jwt", (req ,res) => {
//     let privateKey = fs.readFileSync("./private.pem","utf8")
//     const token = jwt.sign({ "body": "stuff" }, "platform");
//     res.status(200).json({token});
// })


// app.get("/test",isAuthenticatetedKKEM ,form_validator,test)

const cors = require('cors')
//import routers 
const plaform = require("./src/routes/platform");
const assessment = require("./src/routes/assessment")
const test = require("./src/routes/test")

app.use(express.json());
// app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/platform",plaform);
app.use("/assessment", assessment);
app.use("/test",test);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))