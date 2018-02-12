const inContact = require('./inContact');

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
                "text": "To speak with a live agent press 0. To hear more options press 2.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                'timeOut': "5"
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
                "text": "To speak with a live agent press 0.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "input",
                "eventUrl": [process.env.BASE_URL + "ivr"],
                'timeOut': "5"
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
                'timeOut': "5"
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
                'timeOut': "5"
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

module.exports.handleInput = handleInput;
module.exports.handleUnRegisteredInput = handleUnRegisteredInput;