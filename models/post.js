const db = require('./db');

module.exports = {
    create: async (body) => {
        const newPost = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, body.user_id]
        );

        return newPost.insertId;
    },
    find: async (categoryId) => {
        if (categoryId) {
            const postsWithUser = await db.query(
                `SELECT posts.id, title, content, create_date, nickname FROM posts JOIN users ON user_id=users.id WHERE category_id=? ORDER BY create_date DESC`
                , [categoryId]
            );

            return postsWithUser;
        }
        
        const postsWithUser = await db.query(
            `SELECT posts.id, title, content, create_date, nickname FROM posts JOIN users ON user_id=users.id ORDER BY create_date DESC`
        );

        return postsWithUser;
    },
    read: async (postId) => {
        const postsWithUser = await db.query(
            `SELECT posts.id, title, content, category_id, create_date, nickname FROM posts JOIN users ON user_id=users.id WHERE posts.id=?`
            , [postId]
        );
        
        return postsWithUser;
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