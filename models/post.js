const db = require('./db');

module.exports = {
    create: async (body, user) => {
        const newPost = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, 1]
        );

        return newPost.insertId;
    },
    find: async (categoryId) => {
        if (categoryId) {
            const posts = await db.query(
                `SELECT * FROM posts WHERE category_id=? ORDER BY create_date DESC`
                , [categoryId]
            );

            return posts;
        }
        
        const posts = await db.query(
            `SELECT * FROM posts ORDER BY create_date DESC`
        );

        return posts;
    },
    read: async (postId) => {
        const posts = await db.query(
            `SELECT * FROM posts WHERE id=?`
            , [postId]
        );
        
        return posts;
    },
    modify: async (postId, body) => {
        await db.query(
            `UPDATE posts SET title=?, content=?, category_id=?, create_date=Now() WHERE id=?`
            , [body.title, body.content, body.category_id, postId]
        );
    },
    destroy: async (postId) => {
        await db.query(
            `DELETE FROM posts WHERE id=?`
            , [postId]
        );
    }
}