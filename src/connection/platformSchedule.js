const post = require("./methods/post")
async function platformschedule(baseurl, platform_test_id, key ,email , firstName , lastName ,startTestTime, assessement_details_id ) {
    console.log(startTestTime)
    const data =new Object ({
        "testID": `${platform_test_id}`,
        "autoLoginURL": "1",
        "startTestTime": `${startTestTime}`,
        "hrsToLive": "72",
        "candidateData": {
        "emailID": `${email}`,
        "firstName": `${firstName}`,
        "lastName": `${lastName}`,
        "customInfo1": `${assessement_details_id}`,
        "testEndReturnURL": "https://ictkerala.org/"
        },
        "actionFlag": {
        "sendEmail": "Y"
        }
    });
        // console.log("data" ,JSON.stringify(data))
    const extend_url = "/api/schedule/schedule" ;
    const res_data =await post(baseurl,extend_url, data,key);
    return res_data;
}




module.exports = platformschedule