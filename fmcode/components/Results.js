import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { DataTable } from 'react-native-paper';

export default class Results extends React.Component {


	render(){
		return(
			<Text> Spam </Text>


		)
	}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  button: {
  	width: 110,
  	justifyContent: 'center',
  	marginTop: 3,
  	marginBottom: 3
  },
  buttontext: {
  	color: '#fff'
  }
});