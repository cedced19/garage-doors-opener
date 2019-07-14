import React, { Component } from 'react';
import { StatusBar, StyleSheet, Alert } from 'react-native';
import { Container, Button, Text,  Content, Form, Item, Label, Input } from 'native-base';
import I18n from '../i18n/i18n';
import AsyncStorage from '@react-native-community/async-storage';

function makeId() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function isUrl (url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url)
};

function checkEmptyProperties (state) {
  for (var k in state) {
    if (state[k] == '') {
      return k;
    }
  }
  return false;
};

export default class MainScreen extends Component {
  static navigationOptions = {
    title: I18n.t('edit_page_title'),
    headerStyle: {
      backgroundColor: '#7496c4'
    }
  };

  constructor(props) {
    super(props)
    this.state = {
        server: '',
        password: '',
        nickname: '',
        number: '',
        id: ''
    }
    this._saveConfig = this._saveConfig.bind(this);
  };
  
  _saveConfig () {
    const {goBack} = this.props.navigation;
    let emptyProperty = checkEmptyProperties(this.state);
    if (emptyProperty) {
      Alert.alert(
        I18n.t('error'),
        I18n.t('error_' + emptyProperty + '_empty'),
        [{text: I18n.t('ok')}]
      )
    } else if (isNaN(Number(this.state.number))) {
      Alert.alert(
        I18n.t('error'),
        I18n.t('error_invalid_number'),
        [{text: I18n.t('ok')}]
      )
    } else if (!isUrl(this.state.server)) {
      Alert.alert(
        I18n.t('error'),
        I18n.t('error_invalid_address'),
        [{text: I18n.t('ok')}]
      )
    } else {
      AsyncStorage.getItem('garages').then(data => {
        if (data != null) {
          let parsed = JSON.parse(data);
          if (this.props.navigation.state.params.id) {
            for (var k in parsed) {
              if (parsed[k].id == this.props.navigation.state.params.id) {
                parsed[k] = this.state;
              }
            }
          } else {
            parsed.push(this.state);
          }
          
          AsyncStorage.setItem('garages', JSON.stringify(parsed), err => {
            if (!err) {
              goBack();
              this.props.navigation.state.params.onGoBack();
            } else {
              Alert.alert(
                I18n.t('error'),
                I18n.t('error_occured'),
                [{text: I18n.t('ok')}]
              )
            }
          });
        } else {
          AsyncStorage.setItem('garages', JSON.stringify([this.state]), err => {
            if (!err) {
              goBack();
              this.props.navigation.state.params.onGoBack();
            } else {
              Alert.alert(
                I18n.t('error'),
                I18n.t('error_occured'),
                [{text: I18n.t('ok')}]
              )
            }
          });
        }
      });
      
    }

  };

  componentDidMount () {
    if (this.props.navigation.state.params.id) {
      AsyncStorage.getItem('garages').then(data => {
        if (data != null) {
          let parsed = JSON.parse(data);
          if (parsed.length >= 1) {
            for (var k in parsed) {
              if (parsed[k].id == this.props.navigation.state.params.id) {
                this.setState(parsed[k]);
              }
            }
          } 
        }
      });
    } else {
      this.setState({id: makeId()});
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <StatusBar backgroundColor={'#5880b7'} />
        <Content contentContainerStyle ={{paddingHorizontal: 10 }}>
          <Form>
            <Item stackedLabel>
              <Label>{I18n.t('server_address')}</Label>
              <Input value={this.state.server} onChangeText={(text) => this.setState({server: text})} />
            </Item>
            <Item stackedLabel>
              <Label>{I18n.t('password')}</Label>
              <Input value={this.state.password} onChangeText={(text) => this.setState({password: text})} />
            </Item>
            <Item stackedLabel>
              <Label>{I18n.t('garage_number')}</Label>
              <Input value={this.state.number} onChangeText={(text) => this.setState({number: text})}  />
            </Item>
            <Item stackedLabel>
              <Label>{I18n.t('nickname_garage')}</Label>
              <Input value={this.state.nickname} onChangeText={(text) => this.setState({nickname: text})} />
            </Item>
            <Button style={{marginTop: 10 }}  onPress={this._saveConfig}>
              <Text>{I18n.t('edit')}</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: '#7496c4'
  }
});