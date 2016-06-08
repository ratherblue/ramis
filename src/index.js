var http = require('http');

var PORT = 80;

function handleRequest(request, response) {
    response.end('It Works!! Path Hit: ' + request.url);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT); // eslint-disable-line no-console
});


exports.init = function() {
    return false;
};
