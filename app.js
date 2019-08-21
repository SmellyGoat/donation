var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '9bluedogs',
	database : 'donation_db'
});

connection.connect(function(err){
	if (err) throw err;
	console.log("Connected")
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/auth', function(request, response) {
	var username = request.body.uname;
	var password = request.body.psw;

	if (username && password) {
		connection.query('SELECT * FROM user_table WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {//callback and asynchronous functions
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	console.log("Form works");
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.post('/register', function(request, response) {
	var email    = request.body.email;
	var username = request.body.uname;
	var password = request.body.psw;

	if (username && password && email) {
		connection.query('SELECT * FROM user_table WHERE username = ? OR email = ?', [username, email], function(error, results, fields) {//callback and asynchronous functions
			if (results.length > 0) {
				response.send('Email or Username has already been used');
			} else {
				var sql = "INSERT INTO user_table (username, password, email) VALUES ?";
				var values = [[username, password, email]];
				connection.query(sql, [values], function(err, result){
					if (err) throw err;
					console.log("Account successfully created");
				})
				response.send('Account successfully created');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email, Username, and Password!');
		response.end();
	}
});



app.listen(3000);

