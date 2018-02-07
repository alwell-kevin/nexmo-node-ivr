require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sessionManager = require('./sessionManager');
const app = express();

app.get('/answer', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //Get User
    var user = sessionManager.getActiveUser(req.query.from);

    var ncco = [{
            "action": "talk",
            "text": "Thank you for contacting QMES",
            "voiceName": "Amy",
            "bargeIn": false
        },
        {
            "action": "talk",
            "text": "Hello, " + user.firstName + " " + user.lastName + ". If you calling about your most recent "+ user.lastOrder + " order please press 1. Otherwise press 2.",
            "voiceName": "Amy",
            "bargeIn": true
        },
        {
            "action": "input",
            "submitOnHash": true,
            "eventUrl": [process.env.baseUrl + "ivr"]
        }
    ]

    res.json(ncco);
})

app.all('/ivr', function (req, res) {
    console.log("IN IVR", req);

    res.sendStatus(200);
})

app.post('/event', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log("REQUEST START", req)
    res.sendStatus(200);
})

// Start server
app.listen(port, () => {
    console.log('Express server started on port ' + port);
})