import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { Button } from 'native-base';



export default function Homepage() {
	const[names, setNames] = useState([]);
	const[points, setPoints] = useState([]);
	const[gamesplayed, setGamesplayed] = useState([]);

	useEffect(() => {
		loadData();
	}, []); 

	const loadData = async() => {
		const response = await fetch('http://10.0.0.118:3000/home');
		const data = await response.json();
		for(var i = 0; i < data.length; i++){
			names.push(data[i].name);
			points.push(data[i].points);
			gamesplayed.push(data[i].gamesplayed);
		}
	}


	return (
		<View>
			<Text>{points}</Text>
			<Button> 
				<Text> Dummy text </Text>
			</Button>
		</View>
  );
}

