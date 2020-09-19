const db = require('./db');

module.exports = {
    create: async (body) => {
        await db.query(
            `INSERT INTO comments(content, post_id, user_id, parent_comment_id, create_date) VALUES(?, ?, ?, ?, NOW())`
            , [body.content, body.post_id, body.user_id, body.parent_comment_id]);
    },
    find: async (postId) => {
        const commentsWithUser = await db.query(
            `SELECT comments.id, content, user_id, nickname, parent_comment_id, create_date FROM comments JOIN users ON user_id=users.id WHERE post_id=? ORDER BY create_date DESC`
            , [postId]
        );
        
        return commentsWithUser;
    },
}