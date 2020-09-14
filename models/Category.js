const db = require('./db');

module.exports = {
    find: async (categoryId) => {
        if (categoryId) {
            const categories = await db.query(
                `SELECT * FROM categories WHERE id=?`
                , [categoryId]
            );

            return categories;
        }
        
        const categories = await db.query(
            `SELECT * FROM categories`
        );

        return categories;
    },
}