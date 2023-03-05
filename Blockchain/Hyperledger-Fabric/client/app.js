var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

//test
var app = express();
var routes = require('./api/routes');

//require('./api/routes')(app);

app.set('port', 8081);


app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});





// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({
  limit: '5mb'
}));
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));


app.use('/api', routes);
app.use('/node_modules', express.static(__dirname + '/node_modules'));




var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happend on port ' + port);
});
