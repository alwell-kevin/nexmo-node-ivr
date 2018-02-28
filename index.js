require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const sessionManager = require('./sessionManager');
const flowHandler = require('./speechHandling/flowHandler');
const watson = require("./integrations/watson");
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(handleRequest);
//Used to location the conversation (will be stored in session for actual implementation)
var conversation_uuid;
//THIS MAY BE A PROBLEM TODO: FIND SERVER.USE ALTERNATIVE
// app.use(bodyParser.json({
//     type: 'application/json'
// }));

//Lets use our dispatcher
function handleRequest(request, response) {
    try {
        //log the request on console
        console.log(request.url);
        //Dispatch
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

var user;

dispatcher.onGet('/answer', function (req, res) {
    var ncco = [];
    conversation_uuid = req.params.uuid;

    setTimeout(() => {
        //If already active session, then calling user is Agent.
        if (user && user.greeting) {
            ncco = [{
                    "action": "talk",
                    "text": "Hello, thank you for servicing this call. " + user.firstName + " " + user.lastName + " is on the line. Calling about an upcoming appointment.",
                    "voiceName": "Brian"
                },
                {
                    "action": "conversation",
                    "name": "guestware-conference",
                    "startOnEnter": "true",
                    "endOnExit": "true"
                }
            ]
        } else {
            //IF No active session, get user. Launch IVR.
            //Get User
            user = sessionManager.getActiveUser(req.params.from);
            ncco = [{
                    "action": "talk",
                    "text": "Thank you for contacting Active Day... " + user.greeting,
                    "voiceName": "Amy",
                    "bargeIn": true
                },
                {
                    "action": "input",
                    "eventUrl": [process.env.BASE_URL + "ivr"],
                    "maxDigits": "1",
                    'timeOut': "7"
                }
            ]
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(ncco), 'binary');
    }, 650)
})

// THIS IS WHERE I REACT TO THE DTMF INPUT
dispatcher.onPost('/ivr', function (req, res) {
    req.body = JSON.parse(req.body);
    console.log("IN IVR: ", req.body);

    if (user.lastOrder) {
        ncco = flowHandler.handleInput(user, req.body.dtmf);
    } else {
        ncco = flowHandler.handleUnRegisteredInput(user, req.body.dtmf);
    }

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(ncco), 'binary');
})

//Called back after passing to voice chat session
dispatcher.onGet('/voicechat', function (req, res) {
    var ncco = [];

    ncco.push({
        "action": "talk",
        "text": user.firstName + " " + flowHandler.getIntentResponse()
    })
    ncco.push({
        "action": "talk",
        "text": "Press 0 to confirm."
    })

    ncco.push({
        "action": "input",
        "eventUrl": [process.env.BASE_URL + "ivr"],
        "maxDigits": "1",
        "timeOut": "7"
    })

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(ncco), 'binary');
})

dispatcher.onPost('/event', function (req, res) {
    // res.sendStatus(200);
})

//Handle Watson Below
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
});

//Listens for Nexmo websocket audio data. Sends it through Watson Web Socket
wsServer.on('connect', function (connection) {
    console.log("***********IN SOCKET ENDPOINT***********", connection)
    var watsonSocket;

    //Get websocket instance (Open communication with Watson).
    watson.launchWatson(conversation_uuid).then(function (ws) {
        watsonSocket = ws;
    })

    connection.on('message', function (message) {


        if (message.type === 'utf8') {
            console.log("UTF8 AUDIO STREAMING", message);

        } else if (watsonSocket && message.type === 'binary' && message.binaryData) {
            watsonSocket.send(message.binaryData);
        }

    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

})

// Start server
server.listen(port, () => {
    console.log('Express server started on port ' + port);
})