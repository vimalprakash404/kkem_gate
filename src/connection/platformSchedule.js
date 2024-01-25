const post = require("./methods/post")
async function platformschedule(baseurl, platform_test_id, key ,email , firstName , lastName ,startTestTime) {
    const data =new Object ({
        "testID": `${platform_test_id}`,
        "autoLoginURL": "1",
        "startTestTime": `${startTestTime}`,
        "hrsToLive": "72",
        "candidateData": {
        "emailID": `${email}`,
        "firstName": `${firstName}`,
        "lastName": `${lastName}`,
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
        console.log("data" ,JSON.stringify(data))
    const extend_url = "/api/schedule/schedule" ;
    const res_data =await post(baseurl,extend_url, data,key);
    return res_data;
}




module.exports = platformschedule