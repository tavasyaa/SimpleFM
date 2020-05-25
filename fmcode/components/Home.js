import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { Button } from 'native-base'
import { DataTable } from 'react-native-paper';
import Popover from 'react-native-popover-view'

export default class Home extends React.Component {
	state = {
		// season data from db
		data: '',
		// boolean for popover
		isVisible: false
	};

	constructor() {
		super();
		this.simGameweek = this.simGameweek.bind(this);
		this.hidePopover = this.hidePopover.bind(this);
		this.reset = this.reset.bind(this);

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
		fetch('http://10.0.0.118:3000/home', {method: 'PUT'})
			.catch(err => console.log(err))
		this.loadData();
		console.log('gameweek simmed');
	};

	reset() {
		fetch('http://10.0.0.118:3000/reset', {method: 'PUT'})
			.catch(err => console.log(err))
		// this is a bit buggy, maybe we can fix this using promises
		this.state.isVisible = false;
		this.loadData();
	};

	hidePopover() {
		this.setState({isVisible: false});
		console.log(this.state.isVisible);
	};

	render(){


		if (this.state.data.length){

			if (this.state.data[0].gamesplayed >= 10){
				this.state.isVisible = true;
			}

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
        			this.props.navigation.navigate('Players')}>
						<Text style={styles.buttontext}>View Players</Text>
					</Button>

					<Popover isVisible={this.state.isVisible}>
	      				<Text> The season has ended!</Text>
						<Button style={styles.button} onPress={this.hidePopover}>
							<Text style={styles.buttontext}>Cancel</Text>							
						</Button>
						<Button style={styles.button} onPress={this.reset}>
							<Text style={styles.buttontext}>Reset Season</Text>							
						</Button>
						<Text style={styles.buttontext}>{this.state.isVisible}</Text>

   					</Popover>

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