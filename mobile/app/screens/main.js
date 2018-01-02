import React, { Component } from 'react';
import { StatusBar, StyleSheet, AsyncStorage } from 'react-native';
import { Container, Button, Icon, Text, Content, View, Fab, Card, CardItem, Grid, Col, Left, Body, } from 'native-base';
import I18n from '../i18n/i18n';

function getAddress (garage, command) {
  return garage.server.replace(/\/\s*$/, '') + '/garage/' + garage.number + '/' + command + '/' + garage.password;
};

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
    title: 'Garage doors opener',
    headerStyle: {
      backgroundColor: '#7496c4'
    }
  };

  _checkState () {
    let garages = this.state.garages;
    for (var k in garages) {
      return fetch(getAddress(this.state.garages[k], 'status'))
      .then((response) => response.json())
      .then((responseJson) => {
        garages[k].closed = responseJson.closed;
        this.setState({garages});
      })
      .catch((error) => {
        garages[k].closed = 'error';
        this.setState({garages});
      });
    }
  }

  componentDidMount () {
    AsyncStorage.getItem('garages').then(data => {
      if (data != null) {
        let parsed = JSON.parse(data);
        if (parsed.length >= 1) {
          this.setState({noGarage: false, garages: parsed});
          this._checkState();   
        } 
      }
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    var garageDiv = this.state.garages.map((garage) => {
      let garageStatus;
      if (garage.closed === true) {
        garageStatus = <Text>
          {I18n.t('status')}: {I18n.t('garage_closed')}
        </Text>
      } else if (garage.closed === false) {
        garageStatus = <Text>
          {I18n.t('status')}: {I18n.t('garage_not_closed')}
        </Text>
      } else {
        garageStatus = <Text>
          {I18n.t('error_requesting_status')}
        </Text>
      };
      return (
        <Card style={{ flex: 0 }} key={garage.nickname}>
            <CardItem>
                <Left>
                    <Body>
                        <Text>{garage.nickname}</Text>
                        <Text note>{I18n.t('number')} {garage.number}</Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem>
                  <Body>
                      {garageStatus}
                      <Grid>
                        <Col>
                
                        </Col>

                        <Col>
              
                        </Col>

                      </Grid>
                  </Body>
            </CardItem>
       </Card>
      );
    });

    return (
      <Container>
        <StatusBar backgroundColor={'#5880b7'} />
        <Content contentContainerStyle ={{paddingHorizontal: 10 }}>
          {this.state.noGarage ? (
            <Text>
              {I18n.t('no_garage')}
            </Text>
          ) : (
            <View>
              {garageDiv}
            </View>
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
