//TODO: After begin
const minUsernameLen = 4;
const maxUsernameLen = 24;
const minPasswordLen = 6;
const maxPasswordLen = 32;
const usernameWarning = `Invalid username. Must be between ${minUsernameLen} and ${maxUsernameLen} characters.`;
const passwordWarning = `Invalid password. Must be between ${minPasswordLen} and ${maxPasswordLen} characters.`;
const passwordNotMatching = 'Passwords do not match. Please try again.';

$(document).ready(function() {
    $('#login-form').validate({
        debug: true,
        rules: {
            username: {
                required: true,
                minlength: minUsernameLen,
                maxlength: maxUsernameLen
            },
            password: {
                required: true,
                minlength: minPasswordLen,
                maxlength: maxPasswordLen
            }
        },
        messages: {
            username: {
                required: 'Please enter your username',
                minlength: usernameWarning,
                maxlength: usernameWarning
            },
            password: {
                required: 'Please enter your password',
                minlength: passwordWarning,
                maxlength: passwordWarning
            }
        }
    });
});

// function validateRegistration() {
//     let username = document.getElementById('username');
//     let password = document.getElementById('password');
//     let password_retype = document.getElementById('password-retype');
//     let element = document.getElementById('title');

//     if (password.innerHTML != password_retype) {
//         let message = 'Passwords do not match. Please try again.';
//         let newElement = '<span id="validation-warning">' + message + '</span>';
//         element.insertAdjacentHTML('beforebegin', newElement);
//         return false;
//     }

//     if (!isValidUsername(username) && !isValidPassword(password)) {
//         let message = usernameWarning + '<br>' + passwordWarning;
//         let newElement = '<span id="validation-warning">' + message + '</span>';
//         element.insertAdjacentHTML('beforebegin', newElement);
//         return false;
//     } else if (!isValidUsername(username) || !isValidPassword(password)) {
//         if (!isValidUsername(username)) {
//             let message = usernameWarning;
//         }

//         if (!isValidPassword(password)) {
//             let message = passwordWarning;
//         }

//         let newElement = '<span id="validation-warning">' + message + '</span>';
//         element.insertAdjacentHTML('beforebegin', newElement);
//         return false;
//     } else {
//         return true;
//     }
// }

// function validateLogin() {
//     let username = document.getElementById('username');
//     let password = document.getElementById('password');

//     let usernameSpan = document.getElementById('username-validation');
//     let passwordSpan = document.getElementById('password-validation');
//     usernameSpan.innerText = '';
//     passwordSpan.innerText = '';

//     if (!isValidUsername(username)) {
//         usernameSpan.innerText = usernameWarning;
//     }

//     if (!isValidPassword(password)) {
//         passwordSpan.innerText = passwordWarning;
//     }
// }

// function isValidUsername(username) {
//     if (username < minUsernameLen || username > maxUsernameLen) {
//         return false;
//     }
//     return true;
// }

// function isValidPassword(password) {
//     if (password < minPasswordLen || password > maxPasswordLen) {
//         return false;
//     }
//     return true;
// }
