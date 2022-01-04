const { execute } = require('./database.js');
const table = "fullbranas.items";

const get = async type => await execute(`select * from ${table} where type=$1`, [type]);
const create = async ({ text, type }) => await execute(`insert into ${table}(text, type) values ($1, $2) returning *`, [text, type]);

module.exports = { get, create };
