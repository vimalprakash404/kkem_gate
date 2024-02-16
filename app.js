const express = require('express')
const app = express()
const port = 4001
const bodyParser = require("body-parser");
require("./db/connection")
const cors = require('cors')
const platform = require("./src/routes/platform");
const assessment = require("./src/routes/assessment");
const candidate = require("./src/routes/candidate")
const user = require("./src/routes/user")
const kkem = require("./src/routes/kkem")
const fs = require('fs');
const test = require("./src/routes/test");
const path = require('path');
const https = require('https');
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
app.use("/candidate",candidate);
app.use("",user);
app.use("/kkem",kkem)

app.post('*', (req, res) => {
  const requestData = {
    url: req.url,
    body: req.body,
    header : req.headers , 
    datetime: new Date().toLocaleString() // Get the current date and time
  };

  // Convert JavaScript object to JSON string
  const jsonData = JSON.stringify(requestData);

  // Append JSON data to the file
  fs.appendFile('request_data.txt', jsonData + '\n', (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      res.status(500).send('Error appending to file');
    } else {
      console.log('Request data appended to file successfully');
      res.send('POST request received and data appended to file');
    }
  });
});

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});