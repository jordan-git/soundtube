const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function handleSearch(req, res, db) {
    const patterns = [`%${req.body.q}`, `${req.body.q}%`, `%${req.body.q}%`];

    let users = [];
    let media = [];

    for (const pattern of patterns) {
        const userResults = await db.User.findAll({
            where: {
                username: {
                    [Op.like]: pattern
                }
            }
        });

        if (!userResults) {
            continue;
        }

        userResults.forEach(user => {
            users.push(user.dataValues);
        });
    }

    if (users) {
        let userData = [];
        users.forEach(user => {
            userData.push(user);
        });
        users = userData;
    }

    for (const pattern of patterns) {
        const mediaResults = await db.Media.findAll({
            where: {
                title: {
                    [Op.like]: pattern
                }
            }
        });

        if (!mediaResults) {
            continue;
        }

        mediaResults.forEach(m => {
            media.push(m.dataValues);
        });
    }

    if (media) {
        let mediaData = [];
        media.forEach(m => {
            mediaData.push(m);
        });
        media = mediaData;
    }

    console.log(users);
    console.log(media);
}

module.exports = {
    handleSearch: handleSearch
};
