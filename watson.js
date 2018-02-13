var watson = require('watson-developer-cloud');
var WebSocket = require('ws');
var speechAction = require('./speechAction');
var flowHandler = require('./flowHandler');

var authorization = new watson.AuthorizationV1({
    "url": process.env.WATSON_SPEECH_RECOGNITION_URL,
    "username": process.env.WATSON_USERNAME,
    "password": process.env.WATSON_PASSWORD
});

const launchWatson = (conversation_id) => {
    var conversation_uuid = conversation_id;

    return new Promise((resolve, reject) => {
        var ws;
        console.log("LAUNCH WATSON");
        //Create websocket instance with authenticated token.
        authorization.getToken(function (err, token) {
            if (!token) {
                console.log('error:', err);
            } else {
                // Use your token here. Initialize socket.
                console.log("Watson TOKEN: ", token);
                var wsURI = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize' +
                    '?watson-token=' + token +
                    '&model=en-US_BroadbandModel';

                ws = new WebSocket(wsURI);

                ws.on('open', function () {
                    //Sets Watson state to listening.
                    var message = {
                        'action': 'start',
                        'continuous': true,
                        'interim_results': true,
                        'content-type': 'audio/l16;rate=16000'
                    };
                    console.log("WS OPEN AND LISTENING");

                    ws.send(JSON.stringify(message));

                    //On Open and session start. Return Watson object.
                    resolve(ws);
                });

                //Receive text back from watson STT.
                ws.on('message', function (watsonPackage) {
                    var message;

                    watsonPackage = JSON.parse(watsonPackage);

                    //Efficiently parse & map watson result.
                    if (watsonPackage.results) {
                        for (var i = 0; i < watsonPackage.results.length; i++) {
                            var result = watsonPackage.results[i]
                            if (result.final) {

                                if (result.transcript) {
                                    //You can test confidence here with result.confidence.
                                    message = result.transcript;
                                } else if (result.alternatives) {
                                    for (var o = 0; o < result.alternatives.length; o++) {
                                        message = result.alternatives[o].transcript;
                                    }
                                }

                                console.log("WATSON MESSAGE: ", message);
                                //Map speech transcript to intent.
                                speechAction.handleSpeech(message).then((mappedIntent) => {

                                    console.log("mappedIntent: ", mappedIntent);
                                    flowHandler.returnSpeechDataToConversation(mappedIntent, conversation_uuid);

                                    //Stop transmitting to watson.
                                    ws.send(JSON.stringify({
                                        "action": "stop"
                                    }));

                                })

                            }
                        }
                    }
                });
            }
        });
    });
}

module.exports.launchWatson = launchWatson;