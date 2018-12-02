
const redis = require("redis");

const getClient = () => {
    return redis.createClient(
        {
            host: process.env.REDIS_URL,
            port: process.env.REDIS_PORT
        });
};



module.exports.getClient = getClient;