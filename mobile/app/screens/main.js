import React, { Component } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Container, Button, Icon, Text, Content, View, Fab, Card, CardItem, Grid, Col, Left, Body, } from 'native-base';
import I18n from '../i18n/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import DialogProgress from 'react-native-dialog-progress';


function getAddress(garage, command) {
  return garage.server.replace(/\/\s*$/, '') + '/garage/' + garage.number + '/' + command + '/' + garage.password;
};

export default class MainScreen extends Component {
  constructor() {
    super();
    this.state = {
      fabActive: false,
      orderMode: false,
      noGarage: true,
      garages: [],
      garagesStatus: {}
    };

    this._switchPosition = this._switchPosition.bind(this);
    this._checkStatus = this._checkStatus.bind(this);
    this._checkAllStatus = this._checkAllStatus.bind(this);
    this._removeId = this._removeId.bind(this);
    this._toggleDoor = this._toggleDoor.bind(this);
  }

  static navigationOptions = {
    title: 'Garage doors opener',
    headerStyle: {
      backgroundColor: '#7496c4'
    },
    headerRight: <Button title="Info" />
  };

  _switchPosition(id, position) {
    DialogProgress.show({
      title: I18n.t('loading'),
      message: I18n.t('loading_message'),
      isCancelable: false
    });
    let garages = this.state.garages;
    let k = garages.findIndex((item) => item.id == id);
    console.log(id, position);
    if (k != -1) {
      let newPosition = k + position;
      if (newPosition < garages.length && newPosition >= 0) {
        var temp = garages[k];
        garages[k] = garages[newPosition];
        garages[newPosition] = temp;

        AsyncStorage.setItem('garages', JSON.stringify(garages), err => {
          if (err) {
            DialogProgress.hide();
            Alert.alert(
              I18n.t('error'),
              I18n.t('error_occured'),
              [{ text: I18n.t('ok') }]
            )
          } else {
            this.setState({ garages: garages }, () => {
              DialogProgress.hide();
            });
          }
        });
      } else {
        DialogProgress.hide();
      }
    } else {
      DialogProgress.hide();
    }
  }

  _checkAllStatus() {
    let garages = this.state.garages || [];
    let promises = [];
    let ids = [];
    for (let k in garages) {
      promises.push(fetch(getAddress(this.state.garages[k], 'status'))
        .then((response) => response.json())
        .catch((error) => 'error'));
      ids.push(k);
    }
    Promise.all(promises).then((p) => {
      for (let k in p) {
        this.state.garages[ids[k]].closed = p[k].closed;
      }
      this.setState({ garages });
    })

  }

  _checkStatus(garage) {
    var garages = this.state.garages;
    DialogProgress.show({
      title: I18n.t('loading'),
      message: I18n.t('loading_message'),
      isCancelable: false
    });
    fetch(getAddress(garage, 'status'))
      .then((response) => response.json())
      .then((responseJson) => {
        for (k in garages) {
          if (garage.id == garages[k].id) {
            garage.closed = responseJson.closed;
            break;
          }
        }
        this.setState({ garages });
        DialogProgress.hide();
      })
      .catch((error) => {
        for (k in garages) {
          if (garage.id == garages[k].id) {
            garage.closed = 'error';
            break;
          }
        }
        this.setState({ garages });
        DialogProgress.hide();
      });
  }

  _removeId(id) {
    Alert.alert(
      I18n.t('warning'),
      I18n.t('warning_deleting'),
      [
        {
          text: I18n.t('yes'), onPress: () => {
            AsyncStorage.getItem('garages').then(data => {
              if (data != null) {
                let parsed = JSON.parse(data);
                if (parsed.length >= 1) {
                  for (var k in parsed) {
                    if (parsed[k].id == id) {
                      parsed.splice(k, 1);
                      AsyncStorage.setItem('garages', JSON.stringify(parsed), err => {
                        if (err) {
                          Alert.alert(
                            I18n.t('error'),
                            I18n.t('error_occured'),
                            [{ text: I18n.t('ok') }]
                          )
                        } else {
                          this.setState({ garages: parsed, noGarage: (parsed.length == 0) });
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        },
        { text: I18n.t('cancel') }
      ]
    )
  }

  _toggleDoor(garage) {
    Alert.alert(
      I18n.t('warning'),
      I18n.t('warning_toggling'),
      [
        {
          text: I18n.t('yes'), onPress: () => {
            DialogProgress.show({
              title: I18n.t('loading'),
              message: I18n.t('loading_message'),
              isCancelable: false
            });
            fetch(getAddress(garage, 'toggle'))
              .then((response) => response.json())
              .then((responseJson) => {
                DialogProgress.hide();
                Alert.alert(
                  I18n.t('info'),
                  I18n.t('info_command_sent'),
                  [{ text: I18n.t('ok') }]
                )
              })
              .catch((error) => {
                DialogProgress.hide();
                Alert.alert(
                  I18n.t('error'),
                  I18n.t('error_sending_request'),
                  [{ text: I18n.t('ok') }]
                )
              });
          }
        },
        { text: I18n.t('cancel') }
      ]);
  }

  componentDidMount() {
    AsyncStorage.getItem('garages').then(data => {
      if (data != null) {
        let parsed = JSON.parse(data);
        if (parsed.length >= 1) {
          this.setState({ noGarage: false, garages: parsed });
          this._checkAllStatus();
        }
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    const onGoBack = () => {
      AsyncStorage.getItem('garages').then(data => {
        if (data != null) {
          let parsed = JSON.parse(data);
          if (parsed.length >= 1) {
            this.setState({ noGarage: false, garages: parsed });
            this._checkStatus(parsed);
          }
        }
      });
    }
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
        <Card style={{ flex: 0 }} key={garage.id}>
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
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              {this.state.orderMode ? (
                <Grid>
                  <Col>
                    <Button bordered style={{ marginTop: 5 }} onPress={() => this._switchPosition(garage.id, -1)} >
                      <Icon name='md-arrow-round-up' size={60} />
                    </Button>
                  </Col>
                  <Col>
                    <Button bordered style={{ marginTop: 5 }} onPress={() => this._switchPosition(garage.id, 1)}>
                      <Icon name='md-arrow-round-down' size={60} />
                    </Button>
                  </Col>
                </Grid>
              ) : (
                  <Grid>
                    <Col>
                      <Button bordered style={{ marginTop: 5 }} onPress={() => this._toggleDoor(garage)}>
                        <Icon name='md-key' size={60} />
                      </Button>
                    </Col>
                    <Col>
                      <Button bordered style={{ marginTop: 5 }} onPress={() => this._checkStatus(garage)}>
                        <Icon name='md-refresh' size={60} />
                      </Button>
                    </Col>
                    <Col>
                      <Button bordered style={{ marginTop: 5 }} onPress={() => navigate('Edit', { id: garage.id, onGoBack: onGoBack })}>
                        <Icon name='md-create' size={60} />
                      </Button>
                    </Col>
                    <Col>
                      <Button bordered style={{ marginTop: 5 }} onPress={() => this._removeId(garage.id)}>
                        <Icon name='md-trash' size={60} />
                      </Button>
                    </Col>
                  </Grid>
                )}
            </Body>
          </CardItem>
        </Card>
      );
    });

    return (
      <Container>
        <StatusBar backgroundColor={'#5880b7'} />
        <Content contentContainerStyle={{ paddingHorizontal: 10 }}>
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
          containerStyle={{}}
          style={{ backgroundColor: '#7496c4' }}
          position='bottomRight'
          onPress={() => this.setState({ fabActive: !this.state.fabActive })}>
          <Icon name="md-add" />
          <Button onPress={() => this.setState({ orderMode: !this.state.orderMode })} style={{ backgroundColor: '#2980b9' }}>
            <Icon name='md-swap' />
          </Button>
          <Button onPress={() => navigate('Edit', { onGoBack: onGoBack })} style={{ backgroundColor: '#DD5144' }}>
            <Icon name="md-create" />
          </Button>
          <Button onPress={() => this._checkAllStatus()} style={{ backgroundColor: '#16a085' }}>
            <Icon name='md-refresh' />
          </Button>
        </Fab>
      </Container>
    );
  }
}
