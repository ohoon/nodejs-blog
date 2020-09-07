const mysql = require('mysql2');
const util = require('util');
const config = require('./db_config');

const pool = mysql.createPool(config);
console.log('Connection pool created');

pool.on('acquire', (conn) => {
    console.log(`Connection ${conn.threadId} acquired..`);
});

pool.on('enqueue', () => {
    console.log(`Waiting for available connection slot..`);
});

pool.on('release', (conn) => {
    console.log(`Connection ${conn.threadId} released..`);
});

pool.getConnection( (err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database Connection was closed..');
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections..');
        }

        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused..');
        }
    }

    if (conn) {
        conn.release();
    }

    return;
})

pool.query = util.promisify(pool.query);

module.exports = pool;