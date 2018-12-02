
var session = require('express-session');

var redisStore = require('connect-redis')(session);


module.exports = new redisStore({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASS
});
