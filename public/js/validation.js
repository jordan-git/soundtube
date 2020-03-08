const minUsernameLen = 4;
const maxUsernameLen = 24;
const minPasswordLen = 6;
const maxPasswordLen = 32;

const usernameMinWarning = `Username must be at least ${minUsernameLen} characters`;
const usernameMaxWarning = `Username must be no more than ${maxUsernameLen} characters`;
const passwordMinWarning = `Password must be at least ${minPasswordLen} characters`;
const passwordMaxWarning = `Password must be no more than ${maxPasswordLen} characters`;
const postMinWarning = `Post must be at least ${minPasswordLen} characters`;
const postMaxWarning = `Post must be no more than ${maxPasswordLen} characters`;
const passwordNotMatchingWarning = 'Passwords do not match';

// When page has fully loaded
$(document).ready(function() {
    // When user tries to submit the login form
    $('#login-form').validate({
        // Rules to apply
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

        // Message to display if rule is broken
        messages: {
            username: {
                minlength: usernameMinWarning,
                maxlength: usernameMaxWarning
            },
            password: {
                minlength: passwordMinWarning,
                maxlength: passwordMaxWarning
            }
        }
    });

    $('#register-form').validate({
        // Rules to apply
        rules: {
            username: {
                required: true,
                minlength: minUsernameLen,
                maxlength: maxUsernameLen
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: minPasswordLen,
                maxlength: maxPasswordLen
            },
            'password-retype': {
                required: true,
                equalTo: '#password',
                minlength: minPasswordLen,
                maxlength: maxPasswordLen
            }
        },

        // Message to display if rule is broken
        messages: {
            username: {
                minlength: usernameMinWarning,
                maxlength: usernameMaxWarning
            },
            email: 'Please enter a valid email address',
            password: {
                minlength: passwordMinWarning,
                maxlength: passwordMaxWarning
            },
            'password-retype': {
                equalTo: passwordNotMatchingWarning
            }
        }
    });
    $('#user-form').validate({
        rules: {
            password: {
                required: true,
                minlength: minPasswordLen,
                maxlength: maxPasswordLen
            },
            'password-retype': {
                required: true,
                equalTo: '#password',
                minlength: minPasswordLen,
                maxlength: maxPasswordLen
            }
        },
        messages: {
            'password-retype': {
                equalTo: passwordNotMatchingWarning
            }
        }
    });
    $('#profile-form').validate({
        rules: {
            stage_name: {
                maxlength: 32
            },
            email: {
                required: true,
                email: true
            },
            location: {
                maxlength: 48
            },
            interests: {
                maxlength: 64
            },
            favourite_genres: {
                maxlength: 64
            }
        },
        messages: {
            email: 'Please enter a valid email address'
        }
    });
    $('#wall-form').validate({
        rules: {
            new_post: {
                required: true,
                maxlength: 128
            }
        }
    });
});
