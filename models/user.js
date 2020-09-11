const db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    create: async (body) => {
        await db.query(
            `INSERT INTO users(username, password, nickname, email) VALUES(?, ?, ?, ?)`
            , [body.username, body.password, body.nickname, body.email]
        );
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
    encryptPassword: (req, res, next) => {
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        
        return next();
    },
    comparePassword: (plaintext, hash) => {
        return bcrypt.compareSync(plaintext, hash);
    },
}