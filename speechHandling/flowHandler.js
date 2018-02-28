const nexmoParent = require("nexmo");
const inContact = require('../integrations/inContact');
const watson = require("../integrations/watson");
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
                "text": user.firstName + ", your appointment is now confirmed for March 8th at 4pm. You may hang up now",
                "voiceName": "Amy",
                "bargeIn": false
            })
            ncco.push({
                "action": "talk",
                "text": " Or keep listening to the following menu options.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "To discuss home care services press 2. To speak with a live agent press 0.",
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
                "text": "Welcome to our home care services department. Our Qualified caregivers provide assistance with bathing, dressing, grooming, toileting and other hygiene needs. ",
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
                "text": "Please tell me what you are calling about."
            })

            ncco.push({
                "action": "connect",
                "eventUrl": [
                    process.env.BASE_URL + "event"
                ],
                "from": "17326157295",
                "endpoint": [{
                    "type": "websocket",
                    "uri": process.env.BASE_URL + "socket",
                    "content-type": "audio/l16;rate=16000"
                }]
            })
            break;
        default:
            ncco.push({
                "action": "talk",
                "text": "Please wait while we connect you to Ethan Douglass from active day home care services.",
                "voiceName": "Amy",
                "bargeIn": false
            }, {
                "action": "conversation",
                "name": "guestware-conference",
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
                "text": "To discuss home care services press 2. To speak with a live agent press 0.",
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
                "text": "Welcome to our home care services department. Our Qualified caregivers provide assistance with bathing, dressing, grooming, toileting and other hygiene needs. please press 0 to speak with a live agent. Otherwise press 3 to tell us what you are calling about.",
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
                    process.env.BASE_URL + "event"
                ],
                "from": "17326157295",
                "endpoint": [{
                    "type": "websocket",
                    "uri": process.env.BASE_URL + "socket",
                    "content-type": "audio/l16;rate=16000"
                }]
            })
            break;
        default:
            ncco.push({
                "action": "talk",
                "text": "Please wait while we connect you to Ethan from client services.",
                "voiceName": "Amy",
                "bargeIn": false
            }, {
                "action": "conversation",
                "name": "guestware-conference",
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
            "url": [process.env.BASE_URL + "voicechat"]
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