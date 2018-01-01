import React, { Component } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Container, Button, Text,  Content, Form, Item, Label, Input } from 'native-base';


export default class MainScreen extends Component {
  static navigationOptions = {
    title: 'Edit garage command',
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
              <Label>Server adress (with port)</Label>
              <Input onChangeText={(text) => this.state.server = text} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input onChangeText={(text) => this.state.password = text} />
            </Item>
            <Item floatingLabel>
              <Label>Garage number</Label>
              <Input onChangeText={(text) => this.state.number = text} />
            </Item>
            <Item floatingLabel>
              <Label>Nickname garage</Label>
              <Input onChangeText={(text) => this.state.nickname = text} />
            </Item>
            <Button style={{marginTop: 10 }}  onPress={this._startListener}>
              <Text>Edit</Text>
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