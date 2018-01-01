import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MainScreen from './app/screens/main.js';
import EditScreen from './app/screens/edit.js';

export default App = StackNavigator({
  Main: {screen: MainScreen},
  Edit: {screen: EditScreen},
}, {
  navigationOptions: {
   headerStyle:  {
     backgroundColor: '#7496c4'
   },
   headerTintColor: 'white'
  }
});