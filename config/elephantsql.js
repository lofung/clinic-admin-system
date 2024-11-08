const Pool = require("pg").Pool;

require("pg").types.setTypeParser(1114, function(stringValue) {
    console.log(stringValue);
    return new Date(Date.parse(stringValue + "+0000"));
})

const pool = new Pool({
    user: "zmstdodq",
    password: "aYcyWP-bQXwB2fmWpz3dEG9eXTS-KC2M",
    host: "satao.db.elephantsql.com",
    port: 5432,
    database: "zmstdodq",
    dateStrings : true
});

module.exports = pool;

