const registeredUsersList = require('./userRegistery');

const getActiveUser = (phoneNumber) => {
    var activeUser;

    //Get a registered user's information.
    registeredUsersList.forEach(registeredUser => {
        if (registeredUser.phoneNumber === phoneNumber) {
            activeUser = registeredUser;
        }
    });

    //If Unregisted User
    if (!activeUser.firstName) {
        activeUser = registeredUsersList[0];
    }

    console.log("Got user: ", activeUser.firstName + " " + activeUser.lastName);
    return activeUser;
}

module.exports.getActiveUser = getActiveUser;