const pw = require("password-hash");

// Process dictionary containing SQL fields and values
const processData = dict => {
    let fields = [];
    let values = [];

    for (let [key, value] of Object.entries(dict)) {
        fields.push(key);

        // If field is password, hash it first
        if (key == "password") {
            value = pw.generate(value);
        }

        values.push(`'${value}'`);
    }

    let formattedFields = fields.join(", ");
    let formattedValues = values.join(", ");

    // Return two strings of formatted fields and values
    return [formattedFields, formattedValues];
};

// Process dictionary containing SQL fields and values for SET query only (field = value)
const processDataForSetQuery = dict => {
    let entries = [];

    for (const [key, value] of Object.entries(dict)) {
        // If field is password, hash it first
        if (key == "password") {
            value = pw.generate(value);
        }

        entries.push(`${key} = '${value}'`);
    }

    let formattedEntries = entries.join(", ");

    // Return a string of formatted entries (field = value)
    return formattedEntries;
};

class DbHelper {
    constructor(db) {
        this.db = db;
    }

    // Adds a user to the database taking in two strings with the field and value
    createUser(data) {
        data = processData(data);
        let sql = `INSERT INTO users (${data[0]}) VALUES (${data[1]})`;
        this.db.query(sql, (err, result) => {
            if (err) throw err;
        });
    }

    // Delete a user from the database
    deleteUser(username) {
        // Get user's user_id
        let sql = `SELECT user_id FROM users WHERE username = '${username}'`;
        this.db.query(sql, (err, result) => {
            if (err) throw err;
            let user_id = result[0].user_id;

            // Delete profile information
            sql = `DELETE FROM profiles WHERE user_id = '${user_id}'`;
            this.db.query(sql, (err, result) => {
                if (err) throw err;
            });
        });

        // Delete user information
        sql = `DELETE FROM users WHERE username = '${username}'`;
        this.db.query(sql, (err, result) => {
            if (err) throw err;
        });
    }

    // Saves a user's profile info when passed the request
    updateUser(req, data) {
        data = processDataForSetQuery(data);
        let sql = `UPDATE profiles
        SET ${data}
        WHERE user_id = ${req.session.user_id}`;
        this.db.query(sql, (err, result) => {
            if (err) throw err;
        });
    }

    createProfile(username, email, dob) {
        let sql = `SELECT * FROM users WHERE username = '${username}'`;
        this.db.query(sql, (err, result) => {
            if (err) throw err;

            let user_id = result[0].user_id;
            sql = `INSERT INTO profiles (user_id, email, dob, stage_name, location, interests, favourite_genres) 
            VALUES ('${user_id}', '${email}', '${dob}', '', '', '', '')`;
            this.db.query(sql, (err, result) => {
                if (err) throw err;
            });
        });
    }
}

module.exports = DbHelper;
