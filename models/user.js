const db = require('./db');

module.exports = {
    create: async (body) => {
        const newUser = await db.query(
            `INSERT INTO users(username, password, nickname, email) VALUES(?, ?, ?, ?)`
            , [body.username, body.password, body.nickname, body.email]
        );

        return newUser.insertId;
    },
    findById: async (id) => {
        const users = await db.query(
            `SELECT * FROM users WHERE id=?`
            , [id]
        );

        return users;
    },
    findByUsername: async (username) => {
        const users = await db.query(
            `SELECT * FROM users WHERE username=?`
            , [username]
        );

        return users;
    },
    modify: async (body) => {
        let queryText = `UPDATE users SET `;
        const queryValue = [];

        if (body.password) {
            queryText = queryText + `password=?, `;
            queryValue.push(body.password);
        }

        if (body.profile) {
            queryText = queryText + `profile=?, `;
            queryValue.push(body.profile);
        }

        queryText = queryText + `nickname=?, email=? WHERE id=?`;
        queryValue.push(body.nickname, body.email, body.user_id);

        await db.query(
            queryText
            , queryValue
        );
    },
}