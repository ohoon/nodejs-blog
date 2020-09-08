const db = require('./db');

module.exports = {
    create: async (body, user) => {
        const newPost = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, 1]);

        return newPost.insertId;
    },
    find: async (category) => {
        const posts = await db.query(
            `SELECT * FROM posts ORDER BY create_date DESC`
        );

        return posts;
    },
    read: async (postId) => {
        const posts = await db.query(
            `SELECT * FROM posts WHERE id=?`
            , [postId]);
        
        return posts;
    }

}