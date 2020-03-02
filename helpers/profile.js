const fs = require('fs');

async function handleEditProfileGet(req, res, db) {
    // Query user
    const user = await db.User.findOne({
        where: {
            id: req.session.userId
        }
    });

    // Query profile
    const profile = await db.Profile.findOne({
        where: {
            id: user.dataValues.id
        }
    });

    // Store collected information in variables
    const email = user.dataValues.email;
    const [year, month, day] = user.dataValues.date_of_birth.split('-');
    let data = ({
        stage_name,
        avatar,
        location,
        interests,
        favourite_genres
    } = profile.dataValues);
    data.email = email;
    data.year = year;
    data.month = month;
    data.day = day;
    data.title = 'Edit Profile';

    // Passes the object to the web page
    res.render('profile/edit', data);
}

async function handleEditProfilePost(req, res, db) {
    const data = ({
        stage_name,
        email,
        location,
        interests,
        favourite_genres,
        reset_avatar,
        day,
        month,
        year
    } = req.body);
    const date_of_birth = new Date(year, month, day);
    data.date_of_birth = date_of_birth;

    if (req.file && data.reset_avatar != 'Reset') {
        data.avatar = req.file.filename;
    }

    if (data.reset_avatar == 'Reset') {
        data.avatar = '';

        const files = fs.readdirSync('./public/images/avatars');
        const oldAvatarName = `${
            req.session.userId
        }-${req.session.username.toLowerCase()}.`;
        files.forEach(file => {
            let search = file.search(oldAvatarName);
            if (search >= 0) {
                // Async function to delete avatar file and database entry
                deleteAvatar(req, db, () => {
                    data.title = 'Edit Profile';
                    data.success = 'Your avatar has been deleted';
                    res.render('profile/edit', data);
                });
            }
        });
    } else {
        db.Profile.update(data, {
            where: {
                user_id: req.session.userId
            }
        });

        data.title = 'Edit Profile';
        res.render('profile/edit', data);
    }
}

async function handleProfileGet(req, res, db) {
    // if (req.params.id == req.session.userId) {
    //     // Possibly display profile with button like edit profile for own profile
    // }

    // Query profile information
    const profile = await db.Profile.findOne({
        where: {
            id: req.params.id
        }
    });

    // If profile doesn't exist show 404 error
    if (!profile) {
        res.redirect('/error');
        return;
    }

    // Query user information
    const user = await db.User.findOne({
        where: {
            id: profile.dataValues.user_id
        }
    });

    // Package information
    const data = ({
        stage_name,
        avatar,
        location,
        interests,
        favourite_genres
    } = profile.dataValues);
    data.title = `${user.dataValues.username}'s Profile`;
    data.username = user.dataValues.username;

    // Passes the object to the web page and displays it to the viewer
    res.render('profile/profile', data);
}

async function deleteAvatar(req, db, cb) {
    const profile = await db.Profile.findOne({
        where: {
            user_id: req.session.userId
        }
    });
    fs.unlinkSync('./public/images/avatars/' + profile.dataValues.avatar);
    await db.Profile.update(
        {
            avatar: ''
        },
        {
            where: {
                user_id: req.session.userId
            }
        }
    );
    cb();
}

module.exports = {
    handleEditProfile: (req, res, db) => {
        if (req.method == 'GET') handleEditProfileGet(req, res, db);
        else if (req.method == 'POST') handleEditProfilePost(req, res, db);
    },
    handleProfile: handleProfileGet
};
