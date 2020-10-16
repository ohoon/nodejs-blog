const db = require('./db');

module.exports = {
    create: async (nickname, text) => {
        await db.query(
            `INSERT INTO chats(sender, message) VALUES(?, ?)`
            , [nickname, text]
        );
    },
    read: async () => {
        const log = await db.query(
            `SELECT c.sender, c.message FROM (SELECT * FROM chats ORDER BY id DESC LIMIT 100) AS c ORDER BY c.id ASC`
        );

        return log;
    },
}