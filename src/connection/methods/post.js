const axios = require("axios");
const data = require("../getModules");

const post_request = async (baseurl, extend_url, data, key) => {
  try {
    const headers = {
      'X-Api-AuthToken': key,
    } 
    const url = `https://${baseurl}${extend_url}`
    return await axios.post(url, data ,{headers})
            .then(response => {
              console.log(response.data)
              return response.data;
            })
            .catch(error =>{
              console.log(error)
              return error.response.data ;
            })
  }catch(error){

    return error
  }
}

module.exports = post_request;