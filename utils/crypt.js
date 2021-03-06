const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    encryptPassword: (req, res, next) => {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        }

        next();
    },
    comparePassword: (plaintext, hash) => {
        return bcrypt.compareSync(plaintext, hash);
    },
}