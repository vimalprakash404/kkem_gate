const express = require('express')
const app = express()
const port = 3005
const bodyParser = require("body-parser");
require("./db/connection")
const cors = require('cors')
const platform = require("./src/routes/platform");
const assessment = require("./src/routes/assessment");
const candidate = require("./src/routes/candidate")
const test = require("./src/routes/test");
const path = require('path');
const https = require('https');
const fs = require('fs')
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors())
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//router 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const privateKey = fs.readFileSync(path.join(__dirname,'/key/private-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname,'/key/certificate.pem'), 'utf8');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/platform",platform);
app.use("/assessment", assessment);
app.use("",test);
app.use("/candidate",candidate)



const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});