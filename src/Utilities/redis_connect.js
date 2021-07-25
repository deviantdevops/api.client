const REDIS_PARAMS = {
    host: global.config.REDIS.HOST,
    port: global.config.REDIS.PORT || 6379,
    password: global.config.REDIS.PASS,
    family:"IPv4",
    db:"0",
    no_ready_check:true,
    socket_keepalive:true
};

var REDIS = require("redis");
var PUBLISHER = REDIS.createClient(REDIS_PARAMS);
PUBLISHER.on("connect", function() {
    console.log("You are now connected to REDIS");
});

module.exports = PUBLISHER;