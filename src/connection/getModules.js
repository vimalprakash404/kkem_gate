const axios = require("axios");
const getkeyandurl = require("./connection")
const data =async (id) => {
    const {url , key} = getkeyandurl(id)
    const headers = {
        'X-Api-AuthToken': key,
      };
    // return await axios.get(`https://${url}/api/test/getModulesList`, {headers} )
    // .then(response => {
    //     return response.data
    // })
    // .catch(error => {
    //     console.error("Error:", error);
    //     throw new Error(error.message())
    // })
    
}


module.exports = data;