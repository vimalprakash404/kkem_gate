const axios = require("axios");
const { json } = require("body-parser");

async function resultPushBack (url,header,data){
    try{
        const headers = header;
        const body  = data;
        return await axios.post(url, body ,{headers})
            .then(response => {
              return response.data;
            })
            .catch(error =>{
              console.log(error)
              return error.response.data ;
            })
    }catch(error){
        return error;
        console.log("not working")
    }
}

module.exports = resultPushBack ;