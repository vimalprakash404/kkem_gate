const fs = require('fs');
const jwt = require('jsonwebtoken')
const path = require('path');
const privateKey = fs.readFileSync("private.pem", 'utf8');

module.exports = privateKey;