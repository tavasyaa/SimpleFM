const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();

const port = process.env.PORT;

const connection = mysql.createPool({
  host     : process.env.HOST,
  user     : 'root',
  password : process.env.PASSWORD,
  database : 'simplefm'
});

console.log(process.env.USER);
console.log(process.env.HOST);

const app = express();

app.get('/home', function (req, res) {
    connection.getConnection(function (err, connection) {
    	if (err) throw err;
    	connection.query('SELECT * FROM season', function (error, results, fields) {
    		if (error) throw error;
    		res.send(results)
		});
	});
});

app.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT);
});