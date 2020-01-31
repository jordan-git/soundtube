const minUsernameLen = 4;
const maxUsernameLen = 24;
const minPasswordLen = 6;
const maxPasswordLen = 32;
const usernameWarning = `Invalid username. Must be between ${minUsernameLen} and ${minPasswordLen} characters.`;
const passwordWarning = `Invalid password. Must be between ${minPasswordLen} and ${minPasswordLen} characters.`;

function validateRegistration() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let password_retype = document.getElementById('password-retype');
    let element = document.getElementsByTagName('form');

    if (password.innerHTML != password_retype) {
        let message = 'Passwords do not match. Please try again.';
        let newElement = '<span id="validation-warning">' + message + '</span>';
        element.insertAdjacentHTML('beforebegin', newElement);
        return false;
    }

    if (!isValidUsername(username) && !isValidPassword(password)) {
        let message = usernameWarning + '<br>' + passwordWarning;
        let newElement = '<span id="validation-warning">' + message + '</span>';
        element.insertAdjacentHTML('beforebegin', newElement);
        return false;
    } else if (!isValidUsername(username) || !isValidPassword(password)) {
        if (!isValidUsername(username)) {
            let message = usernameWarning;
        }

        if (!isValidPassword(password)) {
            let message = passwordWarning;
        }

        let newElement = '<span id="validation-warning">' + message + '</span>';
        element.insertAdjacentHTML('beforebegin', newElement);
        return false;
    } else {
        return true;
    }
}

function validateLogin() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let element = document.getElementsByTagName('form');

    if (!isValidUsername(username) && !isValidPassword(password)) {
        let message = usernameWarning + '<br>' + passwordWarning;
        let newElement = '<span id="validation-warning">' + message + '</span>';
        element.insertAdjacentHTML('beforebegin', newElement);
        return false;
    } else if (!isValidUsername(username) || !isValidPassword(password)) {
        if (!isValidUsername(username)) {
            let message = usernameWarning;
        }

        if (!isValidPassword(password)) {
            let message = passwordWarning;
        }

        let newElement = '<span id="validation-warning">' + message + '</span>';
        element.insertAdjacentHTML('beforebegin', newElement);
        return false;
    } else {
        return true;
    }
}

function isValidUsername(username) {
    if (username < minUsernameLen || username > maxUsernameLen) {
        return false;
    }
}

function isValidPassword(password) {
    if (password < minPasswordLen || password > maxPasswordLen) {
        return false;
    }
}
