//Install express server
const express = require('express');

const app = express();

// Use the /dist directory
app.use(express.static(__dirname + '/dist/angular-ci-cd-heroku'));

//HTTPS redirect middleware
function ensureSecure(req, res, next) {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto') == 'https' || req.hostname == 'localhost') {
        //Serve Angular App by passing control to the next middleware
        next();
    } else if (req.get('X-Forwarded-Proto') != 'https' && req.get('X-Forwarded-Port') != '443') {
        //Redirect if not HTTP with original request URL
        res.redirect('https://' + req.hostname + req.url);
    }
}

app.use(ensureSecure);

// Catch all other invalid routes
app.all('*', function (req, res) {
    res.status(200).sendFile(__dirname + '/dist/angular-ci-cd-heroku/index.html');
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

