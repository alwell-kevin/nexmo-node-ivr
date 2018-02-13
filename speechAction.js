const intents = [{
        name: "home_modifications",
        keyWords: ["home", "modifications", "improvements", "house", "accessibility"],
        response: "Great, I are forwarding you to our home accessibility department."
    },
    {
        name: "shipping_receiving",
        keyWords: ["shipping", "receiving", "shipment", "tracking", "track"],
        response: "Okay, I am now connecting you to our shipping and receiving department."
    }, {
        name: "payments_processing",
        keyWords: ["payments", "payment", "make", "bill", "pay", "invoice"],
        response: "Please say your credit card long number. Followed by the experation."
    },
    {
        name: "yes",
        keyWords: ["yes", "yeah", "yup", "correct", "right"],
        response: "Confirmed. Thank you."
    },
    {
        name: "no",
        keyWords: ["no", "nah", "nope", "not", "negative"],
        response: "Okay, then how can I help you?"
    },
    {
        name: "unknown",
        keyWords: ["unknown"],
        response: "Sorry, I did not understand you. I would like to connect you with care."
    }

]

//Map transcript to user intent.
//Alternatively, could/should use watson NLU API.
const handleSpeech = (transcript) => {
    var mappedIntent = intents[5]; //Handle Unknown input

    return new Promise(function (resolve, reject) {
        for (var i = 0; i < intents.length; i++) {
            for (var o = 0; o < intents[i].keyWords.length; o++) {
                if (transcript.indexOf(intents[i].keyWords[o]) !== -1) {
                    mappedIntent = intents[i];

                    break;
                }
            }
        }

        resolve(mappedIntent)
    })
}

module.exports.handleSpeech = handleSpeech;