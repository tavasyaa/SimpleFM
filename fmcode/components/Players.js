import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { DataTable } from 'react-native-paper';


export default class Home extends React.Component {
	state = {
		data: ''
	};

	constructor(){
		super();
		this.loadData();
	}

	loadData = async() => {
        fetch('http://10.0.0.118:3000/players')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({ data : responseJson })
            })
            .catch((error) => {
              console.error(error);
            });
		console.log('we got the player data'); 
	};

	render(){
		if(this.state.data.length){
			const rows = []

			for (var i = 0; i < this.state.data.length; i++){
				rows.push(
			        <DataTable.Row key={i}>
			          <DataTable.Cell>{this.state.data[i].name}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].gamesplayed}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].goals}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].assists}</DataTable.Cell>
			          <DataTable.Cell numeric>{this.state.data[i].cleansheets}</DataTable.Cell>
			        </DataTable.Row>
				)
			}

			return(
				<View style={styles.container}>
					<DataTable>
						<DataTable.Header>
						<DataTable.Title>Name</DataTable.Title>
						<DataTable.Title numeric>Games</DataTable.Title>
						<DataTable.Title numeric>Goals</DataTable.Title>
						<DataTable.Title numeric>Assists</DataTable.Title>
						<DataTable.Title numeric>Clean Sheets</DataTable.Title>
						</DataTable.Header>
						{rows}
					</DataTable>
				</View>
			)
		}

			else{
				return(
				<View style={[styles.container, styles.horizontal]}>
      				<ActivityIndicator size="large" color="#0000ff" />
      			</View>
      			)
			}
		);
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