window.onload = function() {
    var socket = io.connect('http://localbox:7200');
    var channel = parent.document.getElementById("channel");
    socket.on('message', function(data) {
        if (data.message) {
            var jsd = JSON.parse(data.message);
            if (channel.value == data.channel) {
                parent.LocalGitty(jsd.title, jsd.message, false);
            }
        } else {
            console.log("There is a problem:", data);
        }
    });
};