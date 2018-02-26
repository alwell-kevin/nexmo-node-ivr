var request = require("request");

const connectCare = () => {
    console.log("IN CALLED CONNECT CARE:", process.env.NEXMO_NUMBER);

    var options = {
        method: 'POST',
        url: 'https://api-b2.incontact.com/inContactAPI/services/v8.0/queuecallback',
        qs: {
            phoneNumber: process.env.NEXMO_NUMBER,
            callDelaySec: 3,
            skill: 4006178 //This drops a user into a specific Queue. Skill number should be associated with Agent Skill (Ex. Logistics -> 204284)
        },
        headers: {
            'cache-control': 'no-cache',
            'Authorization': 'bearer ' + process.env.INCONTACT_ACCESS_TOKEN,
            'content-Type': 'application/json',
        }
    };

    console.log("INCONTACT API REQUEST: ", options);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

module.exports.connectCare = connectCare;