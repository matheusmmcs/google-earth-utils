var express = require('express');
var app = express();
var path    = require("path");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
	console.log('request -> /', res);
  	//res.sendFile(path.join(__dirname+'/public/pages/index.html'));
  	res.sendFile(path.join(__dirname+'/pages/index.html'));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
})
