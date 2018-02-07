require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sessionManager = require('./sessionManager');
const app = express();
var user;

app.get('/answer', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //Get User
    user = sessionManager.getActiveUser(req.query.from);
    setTimeout(() => {
        var ncco = [{
                "action": "talk",
                "text": "Thank you for contacting Q. M. E. S... " + user.greeting,
                "voiceName": "Amy",
                "bargeIn": false
            },
            {
                "action": "input",
                "submitOnHash": true,
                "eventUrl": [process.env.baseUrl + "ivr"]
            }
        ]

        res.json(ncco);
    }, 1250)
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