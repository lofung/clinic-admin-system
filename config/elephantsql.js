const Pool = require("pg").Pool;

const pool = new Pool({
    user: "ywlzdytl",
    password: "Nq61IEDi2gIfdFTxnRJLCmY8hGnGoqLn",
    host: "john.db.elephantsql.com",
    port: 5432,
    database: "ywlzdytl"
});

module.exports = pool;

