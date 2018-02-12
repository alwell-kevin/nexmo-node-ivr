require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sessionManager = require('./sessionManager');
const flowHandler = require('./flowHandler');
const app = express();

//Set music or ringing when customer holding. music on hold parameter
app.use(bodyParser.json({
    type: 'application/json'
}));

var user;

app.get('/answer', function (req, res) {
    var ncco;

    setTimeout(() => {
        //If already active session, then calling user is Agent.
        if (user && user.greeting) {
            ncco = [{
                    "action": "talk",
                    "text": "Hello, thank you for servicing this call. " + user.firstName + " " + user.lastName + " is on the line. Its likely " + user.firstName + " is calling about " + user.lastOrder,
                    "voiceName": "Brian"
                },
                {
                    "action": "conversation",
                    "name": "qmes-conference",
                    "startOnEnter": "true",
                    "endOnExit": "true"
                }
            ]
        } else {
            //IF No active session, get user. Launch IVR.
            //Get User
            user = sessionManager.getActiveUser(req.query.from);
            ncco = [{
                    "action": "talk",
                    "text": "Thank you for contacting Q. M. E. S... " + user.greeting,
                    "voiceName": "Amy",
                    "bargeIn": true
                },
                {
                    "action": "input",
                    "eventUrl": [process.env.BASE_URL + "ivr"],
                    "maxDigits": "1",
                    'timeOut': "5"
                }
            ]
        }

        res.json(ncco);
    }, 1250)
})

app.all('/ivr', function (req, res) {
    console.log("IN IVR: ", req.body);

    if (user.lastOrder) {
        ncco = flowHandler.handleInput(user, req.body.dtmf);
    } else {
        ncco = flowHandler.handleUnRegisteredInput(user, req.body.dtmf);
    }

    res.json(ncco);
})

app.all('/event', function (req, res) {
    console.log("IN EVENT", req.body);

    res.sendStatus(200);
})

// Start server
app.listen(port, () => {
    console.log('Express server started on port ' + port);
})