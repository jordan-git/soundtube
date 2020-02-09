const dbHelper = db => {
    const quoteList = (fields, values) => {
        // Surround each value in quotes
        for (let i = 0; i < values.length; i++) {
            // If field is password, hash it
            if (fields[i] == "password") {
                values[i] = pw.generate(values[i]);
            }

            values[i] = "'" + values[i] + "'";
        }
        return values;
    };

    // Adds a user to the database taking in two lists with the field and value
    const addUser = (fields, values) => {
        // Surround each value in quotes
        values = quoteList(fields, values);

        // Format each value for SQL
        fields = fields.join(", ");
        values = values.join(", ");

        let sql = `INSERT INTO users (${fields}) VALUES (${values})`;
        db.query(sql, (err, result) => {
            if (err) throw err;
        });
    };

    // Delete a user from the database
    const deleteUser = username => {
        // Get user's user_id
        let sql = `SELECT user_id FROM users WHERE username = '${username}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;
            let user_id = result[0].user_id;

            // Delete profile information
            sql = `DELETE FROM profiles WHERE user_id = '${user_id}'}`;
            db.query(sql, (err, result) => {
                if (err) throw err;
            });
        });

        // Delete user information
        sql = `DELETE FROM users WHERE username = '${username}'}`;
        db.query(sql, (err, result) => {
            if (err) throw err;
        });
    };

    // Saves a user's profile info when passed the request and database
    const updateUser = (req, fields, values) => {
        // Surround each value in quotes
        values = quoteList(fields, values);

        // Format each value for SQL
        let entries = [];
        for (let i = 0; i < fields.length; i++) {
            entries.push(`${fields[i]} = ${values[i]}`);
        }
        entries = entries.join(", ");

        let sql = `UPDATE profiles
        SET (${fields}) 
        WHERE user_id = ${req.session.user_id}`;
    };
};

module.exports = dbHelper;
