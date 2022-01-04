const { execute } = require('./database.js');
const table = "fullbranas.items";

const get = async type => await execute(`select * from ${table} where type=$1`, [type]);
const create = async ({ text, type }) => await execute(`insert into ${table}(text, type) values ($1, $2) returning *`, [text, type]);
const destroy = async id => await execute(`delete from ${table} where id=${id}`);

module.exports = { get, create, destroy };
