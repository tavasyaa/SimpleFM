import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { Button } from 'native-base'
import { DataTable } from 'react-native-paper';

export default class Home extends React.Component {
	state = {
		data: ''
	};

	constructor() {
		super();
		this.simGameweek = this.simGameweek.bind(this);
		this.loadData();
	};

	loadData = async() => {
        fetch('http://10.0.0.118:3000/home')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({ data : responseJson })
            })
            .catch((error) => {
              console.error(error);
            });
		console.log('we got the prem table data ;)'); 
	};

// this works, but we need to make it so when the server fails an error is thrown, instead of just twiddling our thumbs
	simGameweek() {
		fetch('http://10.0.0.118:3000/home', {
 			method: 'PUT'})
			.catch(err => console.log(err))

		this.loadData();

		console.log('gameweek simmed');
	};

	render(){
		if (this.state.data.length){

			const rows = []

			for (var i = 0; i < this.state.data.length; i++){
				rows.push(
			        <DataTable.Row key={i}>
			          <DataTable.Cell>{this.state.data[i].name}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].gamesplayed}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].points}</DataTable.Cell>
			        </DataTable.Row>
				)
			}

			return (
				<View style={styles.container}>
					<DataTable>
						<DataTable.Header>
						<DataTable.Title>Team</DataTable.Title>
						<DataTable.Title numeric>Games</DataTable.Title>
						<DataTable.Title numeric>Points</DataTable.Title>
						</DataTable.Header>
						{rows}
					</DataTable>
					<Button style={styles.button} onPress={this.simGameweek}>
						<Text style={styles.buttontext}>Sim Gameweek</Text>
					</Button>
					<Button style={styles.button} onPress={() => 
        			this.props.navigation.navigate('Players')}
        			>
						<Text style={styles.buttontext}>View Players</Text>
					</Button>
				</View>
		  );
		}

		else {
			return (
				<View style={[styles.container, styles.horizontal]}>
      				<ActivityIndicator size="large" color="#0000ff" />
      			</View>
			)
		}
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