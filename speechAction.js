const intents = [{
        name: "room_service",
        keyWords: ["room", "service", "order", "food", "dinner"],
        response: "Great, I am forwarding you to room service..."
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
        response: "Sorry, I did not understand you. I would like to connect you with care..."
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