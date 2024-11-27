import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, Alert, View, Text, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { GlobalContext } from './lib/global-context';

function getAddress(garage, command) {
  return garage.server.replace(/\/\s*$/, '') + '/garage/' + garage.number + '/' + command + '/' + garage.password;
}

export default function MainScreen() {
  const { currentGarage, garageDefined, defineCurrentGarage, removeCurrentGarage, garages, setGarages } = useContext(GlobalContext);
  const [orderMode, setOrderMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadGarages();
  }, []);

  const loadGarages = async () => {
    try {
      const data = await AsyncStorage.getItem('garages');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.length >= 1) {
          setGarages(parsed);
          checkAllStatus(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading garages:', error);
    }
  };

  const switchPosition = async (id, position) => {
    setLoading(true);
    try {
      const updatedGarages = [...garages];
      const k = updatedGarages.findIndex((item) => item.id === id);
      if (k !== -1) {
        const newPosition = k + position;
        if (newPosition < updatedGarages.length && newPosition >= 0) {
          // Swap garages
          [updatedGarages[k], updatedGarages[newPosition]] = [updatedGarages[newPosition], updatedGarages[k]];
          
          await AsyncStorage.setItem('garages', JSON.stringify(updatedGarages));
          setGarages(updatedGarages);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update garage order');
    } finally {
      setLoading(false);
    }
  };

  const checkAllStatus = async (garagesArray = garages) => {
    try {
      const promises = garagesArray.map(async (garage) => {
        try {
          const response = await fetch(getAddress(garage, 'status'));
          return await response.json();
        } catch (error) {
          return { closed: 'error' };
        }
      });

      const statuses = await Promise.all(promises);
      const updatedGarages = garagesArray.map((garage, index) => ({
        ...garage,
        closed: statuses[index].closed
      }));

      setGarages(updatedGarages);
    } catch (error) {
      console.error('Error checking all statuses:', error);
    }
  };

  const checkStatus = async (garage) => {
    setLoading(true);
    try {
      const response = await fetch(getAddress(garage, 'status'));
      const responseJson = await response.json();
      
      const updatedGarages = garages.map(g => 
        g.id === garage.id ? { ...g, closed: responseJson.closed } : g
      );
      
      setGarages(updatedGarages);
    } catch (error) {
      const updatedGarages = garages.map(g => 
        g.id === garage.id ? { ...g, closed: 'error' } : g
      );
      
      setGarages(updatedGarages);
    } finally {
      setLoading(false);
    }
  };

  const removeId = async (id) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to delete this garage?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const updatedGarages = garages.filter(g => g.id !== id);
              await AsyncStorage.setItem('garages', JSON.stringify(updatedGarages));
              setGarages(updatedGarages);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove garage');
            }
          }
        },
        { text: 'Cancel' }
      ]
    );
  };

  const toggleDoor = async (garage) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to toggle the garage door?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(getAddress(garage, 'toggle'));
              await response.json();
              Alert.alert('Info', 'Command sent successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to send request');
            } finally {
              setLoading(false);
            }
          }
        },
        { text: 'Cancel' }
      ]
    );
  };

  const renderGarageStatus = (garage) => {
    if (garage.closed === true) {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="lock-closed-outline"/>
        <Text style={{ fontSize: 17 }}>Status: Garage Closed</Text>
      </View>
      return ;
    } else if (garage.closed === false) {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="lock-open-outline"/>
        <Text style={{ fontSize: 17 }}>Status: Garage Open</Text>
      </View>;
    } else {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="warning-outline"/>
        <Text style={{ fontSize: 17 }}>Error requesting status</Text>;
      </View>
    }
  };

  const garageDiv = garages.map((garage) => (
    <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }} key={garage.id}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{garage.nickname}</Text>
        <Text style={{ color: 'grey', fontSize: 14 }}>Number {garage.number}</Text>
      </View>
      <View>
        {renderGarageStatus(garage)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {orderMode ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onPress={() => switchPosition(garage.id, -1)} 
              icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="arrow-up-outline"/>} 
              buttonStyle={{ backgroundColor: '#7496c4', marginHorizontal: 5, paddingHorizontal: 25 }}
            />
            <Button onPress={() => switchPosition(garage.id, 1)}
              icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="arrow-down-outline"/>} 
              buttonStyle={{ backgroundColor: '#7496c4', marginHorizontal: 5, paddingHorizontal: 25 }}
            />
            </View>
        ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button icon={<Ionicons size={20} style={{ color: '#fff' }} name="key-outline"/>} onPress={() => toggleDoor(garage)} buttonStyle={{ backgroundColor: '#1abc9c', marginHorizontal: 5, paddingHorizontal: 25 }} />
              <Button icon={<Ionicons size={20} style={{ color: '#fff' }} name="refresh-outline"/>} onPress={() => checkStatus(garage)} buttonStyle={{ backgroundColor: '#7496c4', marginHorizontal: 5, paddingHorizontal: 25 }} />
              <Button icon={<Ionicons size={20} style={{ color: '#fff' }} name="pencil-outline"/>} onPress={() => {
              defineCurrentGarage(garage);
              router.navigate('./add-garage');
              }} buttonStyle={{ backgroundColor: '#7496c4', marginHorizontal: 5, marginLeft: 15 }} />
              <Button icon={<Ionicons size={20} style={{ color: '#fff' }} name="trash-outline"/>} onPress={() => removeId(garage.id)} buttonStyle={{ backgroundColor: '#7496c4', marginHorizontal: 5 }} />
            </View>
        )}
      </View>
    </View>
  ));

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <StatusBar backgroundColor='#5880b7' />
      <CustomWaiting
              visible={loading} 
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
      {(garages.length == 0) ? (
        <Text>No garages added.</Text>
      ) : (
        <View>
        {garageDiv}
        </View>
      )}
      </ScrollView>
      <View style={{ marginTop: 20, padding: 10 }}>
        <View style={{ marginBottom: 10 }}>
          <Button 
          title="Order Mode" 
          onPress={() => setOrderMode(!orderMode)} 
          buttonStyle={{ backgroundColor: '#7496c4' }}  
          icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="swap-vertical-outline"/>} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button 
            title="Add Garage" 
            onPress={() => {
              removeCurrentGarage();
              router.navigate('./add-garage');
            }} 
            buttonStyle={{ backgroundColor: '#7496c4' }} 
            icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="add-outline"/>} 
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button 
            title="Refresh All"
            buttonStyle={{ backgroundColor: '#7496c4' }}
            onPress={() => checkAllStatus()} 
            icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="refresh-outline"/>}
          />
        </View>
      </View>
    </View>
  );
}

const CustomWaiting = ({ visible }) => (
  <Modal visible={visible}>
    <View style={{ flex: 1, backgroundColor: "#00000020", justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: "white", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Loading</Text>
        <ActivityIndicator size="large" color="#7496c4" />
      </View>
    </View>
  </Modal>
);