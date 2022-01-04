const { Client } = require('pg');

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "fullbranas",
    port: 5432
});

client.connect();

const execute = (query, values) =>
    new Promise((resolve, reject) =>
        client.query(query, values, (error, result) =>
            error ? reject(error) : resolve(result.rows)
        )
    );

module.exports = { execute };
