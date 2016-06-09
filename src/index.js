var express = require('express'); var app = express();
var path = require('path');
var https = require('https');

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', function(request, response) {
    response.render(path.join(__dirname, 'views', 'index'));
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
            path: '/repos/ratherblue/ramis/statuses/' +
                sha + '?access_token=' + process.env.GITHUB_AUTH_TOKEN,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Ramis-App'
            }
        };

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
        });

        req.write(postData);
        req.end();
    });
});

app.get('/oauth', function(request, response) {
    var params = [
        'client_id=368d97fad7902db3554c',
        'redirect_uri=http://localhost:8080/oauth-success',
        'scope=public_repo'
    ];

    var url = 'https://github.com/login/oauth/authorize?' + params.join('&');

    response.redirect(url);
});

app.get('/oauth-success', function(request, response) {
    response.render(path.join(__dirname, 'views', 'success'));
});


app.listen(port, function() {
    // eslint-disable-next-line no-console
    console.log('Running on http://localhost:' + port);
});

exports.init = function() {
    return false;
};
