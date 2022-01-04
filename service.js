const { execute } = require('./database.js');

const get = async type => await execute("select * from fullbranas.items where type=$1", [type]);

module.exports = { get };
