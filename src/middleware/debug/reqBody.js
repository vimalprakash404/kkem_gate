const fs = require('fs')
const path= require('path')
function reqBody(req,res,next){
    const paste_data = `______________________________________________________________________________________________________________________________________________________________
request date and time : ${new Date(Date.now()).toLocaleString()}
request header : ${JSON.stringify(req.headers)} 
request body : ${JSON.stringify(req.body)}`;

const filePath= path.join(__dirname, 'update_request_log.txt')
console.log(paste_data)
fs.appendFile(filePath, `\n${paste_data}`, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data has been written to', filePath);
    }
});
    next();
}


module.exports = {reqBody}
