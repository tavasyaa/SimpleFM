import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';

export default function Homepage() {
	const[name, setName] = useState([]);
	const[points, setPoints] = useState([]);
	const[gamesplayed, setGamesplayed] = useState([]);

	return (
		<View>
			<Text>{points}</Text>
		</View>
  );
}

