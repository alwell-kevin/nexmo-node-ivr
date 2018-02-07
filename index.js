require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();

app.get('/answer', function (req, res) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var ncco = [{
        "action": "talk",
        "text": "Thank you for contacting Q. M. E. S.",
        "voiceName": "Amy"
    }]

    res.json(ncco);
})

app.all('/event', function (req, res) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.body.status === "answered") {
        console.log("CALL ANSWERED");
    }

    if (req.body.status === "completed") {
        console.log("CALL COMPLETED");
    }

    res.sendStatus(200);
})

// Start server
app.listen(port, () => {
    console.log('Express server started on port ' + port);
})