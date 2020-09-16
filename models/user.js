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
}