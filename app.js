var express = require("express");
var app = express();
var port = 7200;
var fs = require("fs");
var redis = require("redis");
var channel = [];
var channels = ['pi'];

var http = require('http');
http.createServer(function(req, res) {
});

app.set('views', __dirname + '/jade');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res) {
    res.render("notifications");
});
app.get("/post", function(req, res) {
    publishMsg(req.param("c"), req.param("m"));
    res.send(200);
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

for (var i in channels) {
    channel[i] = redis.createClient();
    channel[i].subscribe(channels[i]);
    channel[i].on("message", function(channel, message) {
//        console.log("client channel recieve from channel : %s, the message : %s", channel, message);
        io.sockets.emit('message', {message: message, channel: channel});
    });
}

function publishMsg(channel, message) {
    var redisClient = redis.createClient();
    redisClient.publish(channel, message);
}