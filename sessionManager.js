const registeredUsersList = require('./userRegistery');

const getActiveUser = (phoneNumber) => {
    var activeUser;

    //Get a registered user's information.
    registeredUsersList.forEach(registeredUser => {
        if (registeredUser.phoneNumber === phoneNumber) {
            activeUser = registeredUser;
            activeUser.greeting = "Hello, " + activeUser.firstName + " " + activeUser.lastName + ". If you calling about your most recent " + activeUser.lastOrder + " order please press 1. Otherwise, to hear our call center options press 2.";
        }
    });

    //If Unregisted User
    if (!activeUser || !activeUser.firstName) {
        activeUser = {};
        activeUser.lastOrder = null;
        activeUser.greeting = "I notice you are calling us for the first time. Please listen for the following menu options. For shipping and receiving Press 1. For locations nearest you Press 2.";
    }

    console.log("Got user: ", activeUser.firstName + " " + activeUser.lastName);
    return activeUser;
}

module.exports.getActiveUser = getActiveUser;