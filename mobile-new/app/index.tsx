import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, Alert, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
      return <Text>Status: Garage Closed</Text>;
    } else if (garage.closed === false) {
      return <Text>Status: Garage Open</Text>;
    } else {
      return <Text>Error requesting status</Text>;
    }
  };

  const garageDiv = garages.map((garage) => (
    <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }} key={garage.id}>
      <View>
        <Text>{garage.nickname}</Text>
        <Text>Number {garage.number}</Text>
      </View>
      <View>
        {renderGarageStatus(garage)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {orderMode ? (
          <View>
            <Button onPress={() => switchPosition(garage.id, -1)} 
              icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="arrow-up-outline"/>} 
            />
            <Button onPress={() => switchPosition(garage.id, 1)}
              icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="arrow-down-outline"/>} />
          </View>
        ) : (
          <View>
            <Button icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="key-outline"/>} onPress={() => toggleDoor(garage)} />
            <Button icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="refresh-outline"/>} onPress={() => checkStatus(garage)} />
            <Button icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="pencil-outline"/>} onPress={() => {
              defineCurrentGarage(garage);
              router.navigate('./add-garage');
            }} />
            <Button icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="trash-outline"/>} onPress={() => removeId(garage.id)} />
          </View>
        )}
      </View>
    </View>
  ));

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <StatusBar backgroundColor='#5880b7' />
      {loading && (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <ActivityIndicator size="large" color="#7496c4" />
      </View>
      )}
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
