const db = require('./db');

module.exports = {
    create: async (body) => {
        const newPost = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, body.user_id]
        );

        return newPost.insertId;
    },
    find: async (categoryId, page, limit) => {
        const offset = (page-1) * limit;

        if (categoryId === 0) {
            const postsWithUser = await db.query(
                `SELECT posts.id, title, content, category_id, user_id, nickname, create_date FROM posts JOIN users ON user_id=users.id ORDER BY create_date DESC LIMIT ?, ?`,
                [offset, limit]
            );
    
            return postsWithUser;
        }
        
        const postsWithUser = await db.query(
            `SELECT posts.id, title, content, category_id, user_id, nickname, create_date FROM posts JOIN users ON user_id=users.id WHERE category_id=? ORDER BY create_date DESC LIMIT ?, ?`
            , [categoryId, offset, limit]
        );

        return postsWithUser;
    },
    read: async (postId) => {
        const postsWithUser = await db.query(
            `SELECT posts.id, title, content, category_id, user_id, nickname, create_date FROM posts JOIN users ON user_id=users.id WHERE posts.id=?`
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
    },
    count: async (categoryId) => {
        if (categoryId === 0) {
            const postNum = await db.query(
                `SELECT COUNT(*) AS postNum FROM posts`
            );
            
            return postNum;
        }

        const postNum = await db.query(
            `SELECT COUNT(*) AS postNum FROM posts WHERE category_id=?`
            , [categoryId]
        );
        
        return postNum;
    }
}