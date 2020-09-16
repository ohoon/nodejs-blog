const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    encryptPassword: (req, res, next) => {
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        
        return next();
    },
    comparePassword: (plaintext, hash) => {
        return bcrypt.compareSync(plaintext, hash);
    },
}