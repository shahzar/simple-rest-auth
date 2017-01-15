var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var passport    = require('passport');
var apiRoutes    = require('./routes');
var config    = require('./config/misc');
var port        = process.env.PORT || 8080


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/', function(req,res) {
    res.send("Hello, Api located at /api. Good day!");
});

app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('It has begun ... (At port ' + port + ')');