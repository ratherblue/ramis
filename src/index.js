var express = require('express');
var app = express();
var path = require('path');
var https = require('https');

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    response.render(path.join(__dirname,'views', 'index'));
});

app.post('/event-handler', function(request) {
    var payload = '';
    request.on('data', function(chunk) {
        payload += chunk.toString();
    });

    request.on('end', function() {
        var pullRequest = JSON.parse(payload).pull_request;
        var sha = pullRequest.head.sha;
        var postData = JSON.stringify(
            {
                'state': 'success',
                'target_url': 'https://example.com/build/status',
                'description': 'The build succeeded!',
                'context': 'repo-state'
            }
        );

        var options = {
            protocol: 'https:',
            host: 'api.github.com',
            path: '/repos/ratherblue/ramis/statuses/' + sha + '?access_token=' + process.env.GITHUB_AUTH_TOKEN,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Ramis-App'
            }
        };

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            // res.on('data', function (chunk) {
            //     console.log('body: ' + chunk);
            // });
        });

        req.write(postData);
        req.end();
    });
});


app.listen(port, function() {
    console.log('Running on http://localhost:' + port); // eslint-disable-line no-console
});

exports.init = function() {
    return false;
};
