import React, { Component } from 'react';
import { StatusBar, StyleSheet, AsyncStorage } from 'react-native';
import { Container, Button, Icon, Text, Content, Fab } from 'native-base';


export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      fabActive: false,
      noGarage: true,
      garages: []
    };
  }

  static navigationOptions = {
    title: 'Garage door opener',
    headerStyle: {
      backgroundColor: '#7496c4'
    }
  };

  componentDidMount () {
    AsyncStorage.getItem('garages').then(data => {
      if (data != null) {
        let parsed = JSON.parse(data);
        if (parsed.length >= 1) {
          this.setState({noGarage: false, garages: parsed});
        } 
      }
    });
  };


  render() {
    const { navigate } = this.props.navigation;
    
    return (
      <Container>
        <StatusBar backgroundColor={'#5880b7'} />
        <Content>
          {this.state.noGarage ? (
            <Text>
              There is no garage set.
            </Text>
          ) : (
            <Text>  
              There are one or more garages set.
            </Text>
          )}
        </Content>
        <Fab
            active={this.state.fabActive}
            direction='up'
            containerStyle={{ }}
            style={{ backgroundColor: '#7496c4' }}
            position='bottomRight'
            onPress={() => this.setState({ fabActive: !this.state.fabActive })}>
            <Icon name="md-add" />
            <Button onPress={() => navigate('Edit')} style={{ backgroundColor: '#DD5144' }}>
              <Icon name="md-create" />
            </Button>
          </Fab>
      </Container>
    );
  }
}
