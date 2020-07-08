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
        connection.release();
	});
});

// Next, update the players DB as well for goals scored etc

// simulating a gameweek, simplistic for now - each team has a probability of winning, we multiply that with a random number. 
// the top two teams get wins, the bottom two losses, and the middle two draws. This will be refined with time but it's a good
// start!

// the problem is the way you're making connections, this causes the server to stop responding after a bit. We saw that the 
// client is not the problem because curl bugs out too, and we used select directly with the db so that's not the
// problem either
app.put('/home', function (req, res) {
	// an array with each probability of winning, and the randomized probability for the gameweek
	probs = [];


    connection.getConnection(function (err, connection) {
    	if (err) throw err;

    	// this works, but now "nextgame" can be against yourself which is a problem lol - we don't use this logic for now anyway
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

    		for (var i = 0; i < 6; i++) {
    			if (i < 2){
			    	connection.query('update season set wins = wins + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
					});
				}
				else if (2 <= i < 4){
			    	connection.query('update season set draws = draws + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
					});
				}
                // why do no losses register on the db???
				else if (4 <= i){
                    console.log('we got here');
			    	connection.query('update season set losses = losses + 1 where probability=' + probs[i][0], function (error, results, fields) {
			    		if (error) throw error;
					});
				}
		    }

            begin = 0;
            end = probs.length - 1;
            console.log(probs)

            // entering results into results db but draws are not always draws in results!!
            for (var i = 0; i < (results.length/2); i++) {
                beginscore = Math.round(probs[begin][1]*4);
                endscore = Math.round(probs[end][1]*4);
                query = 'insert into results values' + '(' + '"' + probs[begin][2] + 
                '"' + ',' + '"' + probs[end][2] + '"' + ',' +  beginscore + ',' + endscore + ')';

                connection.query(query, function (error, results, fields) {
                    if (error) throw error;
                });  

                begin = begin + 1;
                end = end - 1;
            }

    	});

    	connection.query('update season set gamesplayed = gamesplayed + 1', function (error, results, fields) {
    		if (error) throw error;
    		res.end();
		});
        connection.release();
	});
});

// printing on players.js
app.get('/players', function (req, res) {
    connection.getConnection(function (err, connection) {
    	if (err) throw err;
    	connection.query('SELECT * FROM players', function (error, results, fields) {
    		if (error) throw error;
    		res.send(results);
		});
        console.log("we got the players")
        connection.release();

	});
});

// getting results data
app.get('/results', function (req, res) {
    connection.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('SELECT * FROM results', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
        connection.release();
    });
});

// reset the db
app.put('/reset', function (req, res) {
    connection.getConnection(function (err, connection) {
        if (err) throw err;
        // resetting season db
        connection.query('update season set gamesplayed = 0, wins = 0, losses = 0, draws = 0', function (error, results, fields) {
            if (error) throw error;
            res.end()
        });
        // resetting player db
        connection.query('update players set gamesplayed = 0, goals = 0, assists = 0, cleansheets = 0', function (error, results, fields) {
            if (error) throw error;
            res.end()
        });

        connection.query('delete from results', function (error, results, fields) {
            if (error) throw error;
            res.end()
        });
        connection.release();
    });
});

app.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT);
});