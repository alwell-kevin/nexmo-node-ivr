const handleInput = (user, selection) => {
    var ncco = [];

    switch (selection) {
        case "1":
            ncco.push({
                "action": "talk",
                "text": user.firstName + ", Your " + user.lastOrder + " order is scheduled to be delivered on March 19th at 3pm.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            break;
        case "2":
            ncco.push({
                "action": "talk",
                "text": "For payments processing press 1. Followed by the pound sign.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "For respiratory care press 2. Followed by the pound sign.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            ncco.push({
                "action": "talk",
                "text": "To speak with a live agent press 3. Followed by the pound sign.",
                "voiceName": "Amy",
                "bargeIn": true
            })
            break;
        case "3":
            ncco.push({
                "action": "talk",
                "text": "Please wait while we connect you to Ethan from customer care.",
                "voiceName": "Amy",
                "bargeIn": false
            })
            break;
        case "4":

            break;
        default:
            break;
    }

    //Always listen for user response
    ncco.push({
        "action": "input",
        "eventUrl": [process.env.baseUrl + "ivr"],
        "submitOnHash": true,
        'timeOut': "10"
    })
    return ncco
}

module.exports.handleInput = handleInput;