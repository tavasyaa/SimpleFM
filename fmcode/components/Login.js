import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { Button, Input, Item } from 'native-base';
import logo from '../assets/nike.png';

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
    	<Image source={logo} style={styles.loginimage} reSizeMode="contain"/>
    	<Item regular style={styles.inputs}>
    		<Input placeholder="Username" />
    	</Item>
    	<Item regular style={styles.inputs}>
    		<Input secureTextEntry={true} placeholder="Password" />
    	</Item>
    	<Button style={styles.button} onPress={() => 
        navigation.navigate('Homepage')
        }
      >
    		<Text style={styles.buttontext}> Login </Text>
    	</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttontext: {
  	color: '#fff'
  },
  button: {
  	width: 60,
  	justifyContent: 'center',
  },
  inputs: {
  	marginTop: 3,
  	marginBottom: 3,
  	width: 250
  }
})