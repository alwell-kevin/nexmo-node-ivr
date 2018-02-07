const registeredUsersList = require('./userRegistery');

const getActiveUser = (phoneNumber) => {
    var activeUser;

    //Get a registered user's information.
    registeredUsersList.forEach(registeredUser => {
        if (registeredUser.phoneNumber === phoneNumber) {
            activeUser = registeredUser;
            activeUser.greeting = "Hello, " + activeUser.firstName + " " + activeUser.lastName + ". If you calling about your most recent " + activeUser.lastOrder + " order please press 1. Otherwise press 2 to hear our call center options.";
        }
    });

    //If Unregisted User
    if (!activeUser.firstName) {
        activeUser = {};
        activeUser.greeting = "I notice you are calling us for the first time. Please listen for the following menu options. Press 1 for shipping and receiving. Press 2 for locations nearest you. Press 3 for sleep therapy.";
    }

    console.log("Got user: ", activeUser.firstName + " " + activeUser.lastName);
    return activeUser;
}

module.exports.getActiveUser = getActiveUser;