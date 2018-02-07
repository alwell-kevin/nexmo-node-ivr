const registeredUsersList = require('./userRegistery');

const getActiveUser = (phoneNumber) => {
    var activeUser;

    //Get a registered user's information.
    registeredUsersList.forEach(registeredUser => {
        if (registeredUser.phoneNumber === phoneNumber) {
            activeUser = registeredUser;
            activeUser.greeting = "Hello, " + activeUser.firstName + " " + activeUser.lastName + ". If you calling about your most recent " + activeUser.lastOrder + " order please press 1 followed by the pound sign. Otherwise, to hear our call center options press 2 followed by the pound sign.";
        }
    });

    //If Unregisted User
    if (!activeUser.firstName) {
        activeUser = {};
        activeUser.greeting = "I notice you are calling us for the first time. Please listen for the following menu options. For shipping and receiving Press 1 followed by the pound sign. For locations nearest you Press 2 followed by the pound sign. For sleep therapy Press 3 followed by the pound sign.";
    }

    console.log("Got user: ", activeUser.firstName + " " + activeUser.lastName);
    return activeUser;
}

module.exports.getActiveUser = getActiveUser;