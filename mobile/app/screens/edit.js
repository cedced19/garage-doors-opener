import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Button, Text,  Content, Form, Item, Label, Input } from 'native-base';
import I18n from '../i18n/i18n';


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