http = require('http');
cors = require('cors');

var express = require('express');
var app = express();
var APIKEY = "52c7cf8730367ab8d74a1cde4de7a754";  //signup at api.openweathermap.org and obtain an API Key

var options = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=Tokyo,jp&units=metric',
    method: 'GET'
};
git commit –m "added my API key to server.js"
app.use(cors());

app.set('view engine', 'ejs');

app.get('/', function(req,res) {
	res.render('getcity');
});

app.get('/weather',function(req,res) {
	var city = req.query.city;

	console.log("City: " + city);
	setOptionPath(city);
	getWeatherDetails(function(data){ 
			data.city = city.toUpperCase();
			res.render('weather', data);
	}); 
}); // end of app.get()

app.get('/api/weather',function(req,res) {
	var city = req.query.city;

	console.log("City: " + city);
	setOptionPath(city);
	getWeatherDetails(function(data) {
		res.json(data);
	})
})

app.listen(process.env.PORT || 8099);

function setOptionPath(city) {
	options.path = "/data/2.5/weather?q=" + city.replace(/ /g,"+") + "&units=metric&APPID=" + APIKEY;
}

function getWeatherDetails(callback) {
	var currTemp = 'N/A';
	var maxTemp = 'N/A';
	var minTemp = 'N/A';
	var humidity = 'N/A';

	var wreq = http.request(options, function(wres,res) {
   	wres.setEncoding('utf8');

		wres.on('data', function (chunk) {
			var jsonObj = JSON.parse(chunk);
			if (!jsonObj.hasOwnProperty("main")) {
				jsonObj.main = 'N/A';
			}
			console.log("Current Temp. : " + jsonObj.main.temp);
			console.log("Max Temp : "      + jsonObj.main.temp_max);
			console.log("Min Temp : "      + jsonObj.main.temp_min);
			console.log("Humidity : "      + jsonObj.main.humidity);
									
			currTemp = jsonObj.main.temp;
			maxTemp = jsonObj.main.temp_max;
			minTemp = jsonObj.main.temp_min;
			humidity = jsonObj.main.humidity;
		});

		wres.on('error',function(e) {
			console.log('Problem with reqsdfdfuest: ' + e.message);
		});

		wres.on('end',function(chunk) {
			callback({currTemp: currTemp,
			          maxTemp: maxTemp,
			          minTemp: minTemp,
			          humidity: humidity});
		});
  }); //http.request
	
	wreq.end();
}

