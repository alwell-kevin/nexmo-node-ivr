require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sessionManager = require('./sessionManager');
const flowHandler = require('./flowHandler');
const app = express();

app.use(bodyParser.json({
    type: 'application/json'
}));

var user;

app.get('/answer', function (req, res) {
    //Get User
    user = sessionManager.getActiveUser(req.query.from);
    setTimeout(() => {
        var ncco = [{
                "action": "talk",
                "text": "Thank you for contacting Q. M. E. S... " + user.greeting,
                "voiceName": "Amy",
                "bargeIn": true
            },
            {
                "action": "input",
                "eventUrl": [process.env.baseUrl + "ivr"],
                "submitOnHash": true,
                'timeOut': "10"
            }
        ]

        res.json(ncco);
    }, 1250)
})

app.all('/ivr', function (req, res) {
    console.log("IN IVR: ", req.body)
    ncco = flowHandler.handleInput(user, req.body.dtmf);

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