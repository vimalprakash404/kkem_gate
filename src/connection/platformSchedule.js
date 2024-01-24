const post = require("./methods/post")
const axios = require("axios").default
async function platformschedule(baseurl, platform_test_id, key) {
    const data =new Object ({
        "testID": "1908715",
        "autoLoginURL": "1",
        "startTestTime": "2024-24-01 10:56:00",
        "hrsToLive": "72",
        "candidateData": {
        "emailID": "vimalprakash332@gmail.com",
        "firstName": "Mark",
        "lastName": "Depp",
        "customInfo1": "CandID1234",
        "customInfo2": "JobReqID1234",
        "customInfo3": "custom Info 3",
        "customInfo4": "custom Info 4",
        "invigilatorUsername":"Teasd",
        "evaluatorUsername":"Teasd",
        "testEndReturnURL": "https://www.example.com"
        },
        "actionFlag": {
        "sendEmail": "Y"
        }
    });
        
    const extend_url = "/api/schedule/schedule" ;
    const res_data =await post(baseurl,extend_url, data,key);
    return res_data;
}




module.exports = platformschedule