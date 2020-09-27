const db = require('./db');

module.exports = {
    create: async (file) => {
        await db.query(
            `INSERT INTO files(filename, path, size) VALUES(?, ?, ?)`
            , [file.filename, file.path.slice(6), file.size]
        );
    },
    assign: async (postId, images) => {
        const size = images.length;
        const where = [];

        for (let i=0; i<size; i++) {
            where.push("filename=?");
        }

        const queryText = where.join(" OR ");
        const queryValue = [postId].concat(images);

        await db.query(
            `UPDATE files SET post_id=? WHERE post_id IS NULL AND ${queryText}`
            , queryValue
        );
    },
    unassign: async (postId) => {
        await db.query(
            `UPDATE files SET post_id=NULL WHERE post_id=?`
            , [postId]
        );
    }
}