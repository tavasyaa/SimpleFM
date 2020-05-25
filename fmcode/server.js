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

const app = express();

// printing the data on the home screen
app.get('/home', function (req, res) {
    connection.getConnection(function (err, connection) {
    	if (err) throw err;
    	connection.query('SELECT * FROM season', function (error, results, fields) {
    		if (error) throw error;
    		res.send(results)
		});
	});
});



// simulating a gameweek, simplistic for now - each team has a probability of winning, we multiply that with a random number. 
// the top two teams get wins, the bottom two losses, and the middle two draws. This will be refined with time but it's a good
// start!
// Append in results DB as well!
app.put('/home', function (req, res) {
	// an array with each probability of winning, and the randomized probability for the gameweek
	probs = [];


    connection.getConnection(function (err, connection) {
    	if (err) throw err;

    	// this works, but now "nextgame" can be against yourself which is a problem lol
    	connection.query('update season set nextgame = (nextgame % 6) + 1', function(error, results, fields){
    		if (error) throw error;
    	});

    	connection.query('select * from season', function(error, results, fields){
    		if (error) throw error;

    		for (var i = 0; i < results.length; i++){
    			probs.push([results[i].probability, results[i].probability * Math.random(), results[i].name]);
    		}

    		probs.sort(function (a, b){
    			return b[1]-a[1];
    		})

    		console.log(probs);

    		for (var i = 0; i < 6; i++) {
    			if (i < 2){
			    	connection.query('update season set wins = wins + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
			    		console.log(results);
					});
				}
				else if (2 <= i < 4){
			    	connection.query('update season set draws = draws + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
			    		console.log(results);
					});
				}
				else {
			    	connection.query('update season set losses = losses + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
			    		console.log(results);
					});
				}
		    }

            // TO WRITE: update the results db with the results we just got, use the rand shit to put in scores
           /* connection.query('insert into results value', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
            });*/

    	});

    	connection.query('update season set gamesplayed = gamesplayed + 1', function (error, results, fields) {
    		if (error) throw error;
    		res.end();
		});
	});
});

// printing on players.js
app.get('/players', function (req, res) {
    connection.getConnection(function (err, connection) {
    	if (err) throw err;
    	connection.query('SELECT * FROM players', function (error, results, fields) {
    		if (error) throw error;
    		res.send(results);
    		console.log(results[0].name);
		});
	});
});

// reset the db
app.put('/reset', function (req, res) {
    connection.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('update season set gamesplayed = 0, wins = 0, losses = 0, draws = 0', function (error, results, fields) {
            if (error) throw error;
            res.end()
        });
    });
});

app.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT);
});