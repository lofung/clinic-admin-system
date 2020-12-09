const Pool = require("pg").Pool;

require("pg").types.setTypeParser(1114, function(stringValue) {
    console.log(stringValue);
    return new Date(Date.parse(stringValue + "+0000"));
})

const pool = new Pool({
    user: "ywlzdytl",
    password: "Nq61IEDi2gIfdFTxnRJLCmY8hGnGoqLn",
    host: "john.db.elephantsql.com",
    port: 5432,
    database: "ywlzdytl",
    dateStrings : true
});

module.exports = pool;

