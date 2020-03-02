const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function handleSearch(req, res, db) {
    let userResults;
    const patterns = [`%${req.body.q}`, `${req.body.q}%`, `%${req.body.q}%`];

    let users = {};
    let media = {};
    for (let i = 0; i < patterns.length; i++) {
        const userResults = await db.User.findAll({
            where: {
                username: {
                    [Op.like]: patterns[i]
                }
            }
        });

        if (!userResults) {
            continue;
        }

        userResults.forEach(user => {
            users[user.dataValues.username] = user.dataValues;
        });
    }

    if (users) {
        const userData = [];
        for (let user in users) {
            userData.push({
                id: user.id,
                username: user.username
            });
        }
        console.log(userData);
    }

    // if (media) {
    //     const mediaData = [];
    //     Object.keys(media).forEach(m => {
    //         mediaData.push({
    //             id: m.id,
    //             username: m.username
    //         });
    //     });
    //     console.log(mediaData);
    // }
}

// const mediaResults = await db.Media.findAll({
//     where: {
//         title: {
//             [Op.like]: `${req.body.q}`
//         }
//     }
// });
// console.log(mediaResults);

module.exports = {
    handleSearch: handleSearch
};
