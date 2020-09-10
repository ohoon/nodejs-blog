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
    encryptPassword: (req, res, next) => {
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        return next();
    }
}