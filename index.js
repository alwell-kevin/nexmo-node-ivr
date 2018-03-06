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

// BEGIN NEXMO WEBSOCKET IMPLEMENTATION

//Handle Watson Below
var nexmoWebSocketServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
});

//Listens for Nexmo websocket audio data. Sends it through Watson Web Socket
nexmoWebSocketServer.on('connect', function (connection) {
    console.log("***********IN SOCKET ENDPOINT***********", connection)

    var recognizeStream = new RecognizeStream(connection);
})

class RecognizeStream {
    constructor(connection) {
        this.streamCreatedAt = null;
        this.stream = null;
        this.user = null
        this.request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US' //Default Lang, will be updated with value from websocket
            },
            interimResults: false // If you want interim results, set this to true
        };
        connection.on('message', this.processMessage.bind(this));
        connection.on('close', this.close.bind(this));
        this.getStream().then(function (stream) {
            this.stream = stream;
        }.bind(this))
    }

    processMessage(message) {

        if (message.type === 'utf8') {
            // Log the initial Message
            var data = JSON.parse(message.utf8Data)
            this.request.config.languageCode = data.languageCode
            this.user = data.user
        } else if (message.type === 'binary') {
            if (this.stream) {
                this.stream.send(message.binaryData);
            }
        }

    }


    close() {
        console.log((new Date()) + ' Peer disconnected.');
        this.stream.close()
    }

    newStreamRequired() {
        // No stream exists
        if (!this.stream) {
            return true;
        }
        // check time since stream was created.  If 60+ seconds ago create a new stream
        else {
            const now = new Date();
            const timeSinceStreamCreated = (now - this.streamCreatedAt); // returns millis since stream created
            return (timeSinceStreamCreated / 1000) > 60;
        }
    }

    // helper function to ensure we always get a stream object with enough time remaining to work with
    getStream() {
        var self = this;

        return new Promise((resolve, reject) => {
            if (self.newStreamRequired()) {
                if (self.stream) {
                    self.stream.destroy();
                }
                self.streamCreatedAt = new Date();
                //console.log("Sending request as " + self.request.config.languageCode);
                watson.launchWatson(conversation_uuid).then(function (ws) {
                    self.stream = ws;
                    console.log("STREAM SET: ", self.stream);
                    resolve(self.stream);
                })
            } else {
                resolve(self.stream);
            }
        })
    }
}

// FINISH NEXMO WEBSOCKET IMPLEMENTATION














// BEGIN IVR ROUTING IMPLEMENTATION


//Used to location the conversation (will be stored in session for actual implementation)
var conversation_uuid;


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
                    "text": "Hello, thank you for servicing this call. " + user.firstName + " " + user.lastName + " is on the line. Calling about room service.",
                    "voiceName": "Brian"
                },
                {
                    "action": "conversation",
                    "name": "guestware-conference",
                    "startOnEnter": "true",
                    "endOnExit": "true"
                }
            ]

            user = null;
        } else {
            //IF No active session, get user. Launch IVR.
            //Get User
            user = sessionManager.getActiveUser(req.params.from);
            ncco = [{
                    "action": "talk",
                    "text": "Thank you for contacting the front desk powered by guest wear... " + user.greeting,
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

    if (user.firstName) {
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
    console.log(JSON.parse(req.body).status)

    res.writeHead(200);
    res.end();
})

// Start server
server.listen(port, () => {
    console.log('Express server started on port ' + port);
})