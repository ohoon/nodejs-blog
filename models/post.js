const db = require('./db');

module.exports = {
    create: async (body) => {
        const newPost = await db.query(
            `INSERT INTO posts(title, content, category_id, user_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.title, body.content, body.category_id, body.user_id]
        );

        return newPost.insertId;
    },
    find: async (categoryId, page, limit, search) => {
        let queryText = `SELECT p.id, p.title, p.content, p.category_id, p.user_id, u.nickname, p.create_date, p.views FROM posts AS p LEFT JOIN users AS u ON p.user_id=u.id`
        const queryValue = [];
        const offset = (page-1) * limit;

        if (categoryId > 0) {
            queryText = queryText + ` WHERE category_id=?`;
            queryValue.push(categoryId);
        }

        if (search) {
            queryText = queryText + ((categoryId>0)?` AND`:` WHERE`);
            queryText = queryText + ` (title LIKE ? OR content LIKE ?)`;
            queryValue.push(`%${search}%`, `%${search}%`);
        }
    
        queryText = queryText + ` ORDER BY create_date DESC`;
        
        if (page && limit) {
            queryText = queryText + ` LIMIT ?, ?`;
            queryValue.push(offset, limit);
        }

        queryText = `SELECT p2.*, f.path AS thumnail FROM (${queryText}) AS p2 LEFT JOIN files AS f ON f.post_id=p2.id GROUP BY p2.id`
        queryText = `SELECT p3.*, COUNT(c.id) AS commentNum FROM (${queryText}) AS p3 LEFT JOIN comments AS c ON p3.id=c.post_id GROUP BY p3.id`;

        const postsWithUser = await db.query(
            queryText,
            queryValue
        );

        return postsWithUser;
    },
    read: async (postId) => {
        const postsWithUser = await db.query(
            `SELECT posts.id, title, content, category_id, user_id, nickname, create_date, views FROM posts JOIN users ON user_id=users.id WHERE posts.id=?`
            , [postId]
        );
        
        return postsWithUser;
    },
    modify: async (body) => {
        await db.query(
            `UPDATE posts SET title=?, content=?, category_id=?, create_date=Now() WHERE id=?`
            , [body.title, body.content, body.category_id, body.post_id]
        );
    },
    destroy: async (postId) => {
        await db.query(
            `DELETE FROM posts WHERE id=?`
            , [postId]
        );
    },
    count: async (categoryId, search) => {
        let queryText = 'SELECT COUNT(*) AS postNum FROM posts';
        const queryValue = [];
        
        if (categoryId > 0) {
            queryText = queryText + ` WHERE category_id=?`;
            queryValue.push(categoryId);
        }

        if (search) {
            queryText = queryText + ((categoryId>0)?` AND`:` WHERE`);
            queryText = queryText + ` (title LIKE ? OR content LIKE ?)`;
            queryValue.push(`%${search}%`, `%${search}%`);
        }
        
        const postNum = await db.query(
            queryText
            , queryValue
        );
        
        return postNum;
    },
    watch: async (postId) => {
        await db.query(
            `UPDATE posts SET views=views+1 WHERE id=?`
            , [postId]
        );
    }
}