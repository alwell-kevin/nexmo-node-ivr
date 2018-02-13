const nexmoParent = require("nexmo");
const inContact = require('./inContact');
const watson = require("./watson");
var response;

//Instantiate Nexmo Object
var nexmo = new nexmoParent({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
    applicationId: process.env.NEXMO_APP_ID,
    privateKey: process.env.NEXMO_PRIVATE_KEY,
});

//Handles registerd numbers from userRegistery.json
const handleInput = (user, selection) => {
    var ncco = [];

    switch (selection) {
        case "1":
            ncco.push({
                "action": "talk",
                "text": user.firstName + ", Your " + user.lastOrder + " order is scheduled to be delivered on March 19th at 3pm.",
                "voiceName": "Amy",
                "bargeIn": false
            })
            ncco.push({
                "action": "talk",
                "text": "To say, rather than type your selection please press 3.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "To speak with a live agent press 0. To hear more options press 2.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                "maxDigits": "1",
                'timeOut': "7"
            })
            break;
        case "2":
            ncco.push({
                "action": "talk",
                "text": "For payments processing press 2.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "To say, rather than type your selection please press 3.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "To speak with a live agent press 0.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                "maxDigits": "1",
                'timeOut': "7"
            })
            break;
        case "3":
            console.log("Handling Voice Bot");

            ncco.push({
                "action": "talk",
                "text": "Please say what you are calling about."
            })

            ncco.push({
                "action": "connect",
                "eventUrl": [
                    "https://12ab0171.ngrok.io/event"
                ],
                "from": "17326157295",
                "endpoint": [{
                    "type": "websocket",
                    "uri": "https://12ab0171.ngrok.io/socket",
                    "content-type": "audio/l16;rate=16000"
                }]
            })
            break;
        default:
            ncco.push({
                "action": "talk",
                "text": "Please wait while we connect you to Ethan Douglass from customer services.",
                "voiceName": "Amy",
                "bargeIn": false
            }, {
                "action": "conversation",
                "name": "qmes-conference",
                "startOnEnter": "false"
            })

            //Queue Call
            inContact.connectCare();
            break;
    }

    return ncco
}

//Handle Phone number that called in is unregistered.
const handleUnRegisteredInput = (user, input) => {
    var ncco = [];

    switch (input) {
        case "1":
            ncco.push({
                "action": "talk",
                "text": "Welcome to Q.M.E.S, shipping & receiving. To place an order please press 0. Followed by the pound sign.",
                "voiceName": "Amy",
                "bargeIn": false
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                "maxDigits": "1",
                'timeOut': "7"
            })
            break;
        case "2":
            ncco.push({
                "action": "talk",
                "text": "Welcome to Q.M.E.S, location directory. Our location nearest you is 35 minutes south west in pottsville, pennsylvania. For more options, please press 0 then pound.",
                "voiceName": "Amy",
                "bargeIn": false
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                "maxDigits": "1",
                'timeOut': "7"
            })
            break;
        case "3":
            console.log("Handling Voice Bot");

            ncco.push({
                "action": "talk",
                "text": "Please say what you are calling about."
            })

            ncco.push({
                "action": "connect",
                "eventUrl": [
                    "https://12ab0171.ngrok.io/event"
                ],
                "from": "17326157295",
                "endpoint": [{
                    "type": "websocket",
                    "uri": "https://12ab0171.ngrok.io/socket",
                    "content-type": "audio/l16;rate=16000"
                }]
            })
            break;
        default:
            ncco.push({
                "action": "talk",
                "text": "Please wait while we connect you to Ethan from customer services.",
                "voiceName": "Amy",
                "bargeIn": false
            }, {
                "action": "conversation",
                "name": "qmes-conference",
                "startOnEnter": "false"
            })

            //Queue Call
            inContact.connectCare();
            break;
    }

    return ncco
}

var setIntentResponse = (intent) => {
    response = intent.response;
}

var getIntentResponse = () => {
    return response;
}

//We get conversation_uuid from the call. 
const returnSpeechDataToConversation = (intent, conversation_uuid) => {
    var jwt = nexmo.generateJwt();

    nexmo.calls.update(conversation_uuid, {
        "action": "transfer",
        "destination": {
            "type": "ncco",
            "url": ["https://12ab0171.ngrok.io/voicechat"]
        }
    }, function () {
        setIntentResponse(intent);
    });

    console.log(intent);
}

module.exports.getIntentResponse = getIntentResponse;
module.exports.handleInput = handleInput;
module.exports.handleUnRegisteredInput = handleUnRegisteredInput;
module.exports.returnSpeechDataToConversation = returnSpeechDataToConversation;