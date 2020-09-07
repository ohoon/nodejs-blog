const db = require('./db');

module.exports = {
    create: async (body, user) => {
        const new_post = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, 1]);

        return new_post.insertId;
    },
    find: async (category) => {
        const posts = await db.query(
            `SELECT * FROM posts ORDER BY create_date DESC`
        );

        return posts;
    }

}