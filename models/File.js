const db = require('./db');

module.exports = {
    create: async (file) => {
        await db.query(
            `INSERT INTO files(filename, path, size) VALUES(?, ?, ?)`
            , [file.filename, file.path.slice(6), file.size]
        );
    }
}