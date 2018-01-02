import React, { Component } from 'react';
import { StatusBar, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Container, Button, Text,  Content, Form, Item, Label, Input } from 'native-base';
import I18n from '../i18n/i18n';


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
        number: ''
    }
    this._saveConfig = this._saveConfig.bind(this);
  };
  
  _saveConfig () {
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
          parsed.push(this.state);
          AsyncStorage.setItem('garages', JSON.stringify(parsed), err => {
            if (!err) {
              this.props.navigation.navigate('Main');
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
              this.props.navigation.navigate('Main');
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <StatusBar backgroundColor={'#5880b7'} />
        <Content contentContainerStyle ={{paddingHorizontal: 10 }}>
          <Form>
            <Item floatingLabel>
              <Label>{I18n.t('server_address')}</Label>
              <Input onChangeText={(text) => this.state.server = text} />
            </Item>
            <Item floatingLabel>
              <Label>{I18n.t('password')}</Label>
              <Input onChangeText={(text) => this.state.password = text} />
            </Item>
            <Item floatingLabel>
              <Label>{I18n.t('garage_number')}</Label>
              <Input onChangeText={(text) => this.state.number = text} />
            </Item>
            <Item floatingLabel>
              <Label>{I18n.t('nickname_garage')}</Label>
              <Input onChangeText={(text) => this.state.nickname = text} />
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