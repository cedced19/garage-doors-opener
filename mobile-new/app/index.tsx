import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, Alert, View, Text, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { GlobalContext } from './lib/global-context';
import { useTranslation } from "react-i18next";

export default function MainScreen() {
  const { t } = useTranslation();
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
      Alert.alert(t('error'), t('error_updating_garage_order'));
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
      t('warning'),
      t('warning_deleting'),
      [
        {
          text: t('yes'),
          onPress: async () => {
            try {
              const updatedGarages = garages.filter(g => g.id !== id);
              await AsyncStorage.setItem('garages', JSON.stringify(updatedGarages));
              setGarages(updatedGarages);
            } catch (error) {
              Alert.alert(t('error'), t('error_removing_garage'));
            }
          }
        },
        { text: t('cancel') }
      ]
    );
  };

  const toggleDoor = async (garage) => {
    Alert.alert(
      t('warning'),
      t('warning_toggling'),
      [
        {
          text: t('yes'),
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(getAddress(garage, 'toggle'));
              await response.json();
              Alert.alert(t('info'), t('info_command_sent'));
            } catch (error) {
              Alert.alert(t('error'), t('error_sending_request'));
            } finally {
              setLoading(false);
            }
          }
        },
        { text: t('cancel') }
      ]
    );
  };

  const renderGarageStatus = (garage) => {
    if (garage.closed === true) {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="lock-closed-outline"/>
        <Text style={{ fontSize: 17 }}>{t('garage_closed')}</Text>
      </View>
    } else if (garage.closed === false) {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="lock-open-outline"/>
        <Text style={{ fontSize: 17 }}>{t('garage_not_closed')}</Text>
      </View>;
    } else {
      return <View>
        <Ionicons size={40} style={{ marginEnd: 5, color: '#000' }} name="warning-outline"/>
        <Text style={{ fontSize: 17 }}>{t('error_requesting_status')}</Text>
      </View>
    }
  };

  const garageDiv = garages.map((garage) => (
    <View style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }} key={garage.id}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{garage.nickname}</Text>
        <Text style={{ color: 'grey', fontSize: 14 }}>{t('number')} {garage.number}</Text>
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
              text={t('loading')}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }}>
      {(garages.length == 0) ? (
        <Text>{t('no_garages_added')}</Text>
      ) : (
        <View>
        {garageDiv}
        </View>
      )}
      </ScrollView>
      <View style={{ marginTop: 20, padding: 10 }}>
        <View style={{ marginBottom: 10 }}>
          <Button 
          title={t('order_garages')} 
          onPress={() => setOrderMode(!orderMode)} 
          buttonStyle={{ backgroundColor: '#7496c4' }}  
          icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="swap-vertical-outline"/>} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button 
            title={t('add_garage')} 
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
            title={t('refresh_all')}
            buttonStyle={{ backgroundColor: '#7496c4' }}
            onPress={() => checkAllStatus()} 
            icon={<Ionicons size={20} style={{ marginEnd: 5, color: '#fff' }} name="refresh-outline"/>}
          />
        </View>
      </View>
    </View>
  );
}

const CustomWaiting = ({ text, visible }) => (
  <Modal visible={visible}>
    <View style={{ flex: 1, backgroundColor: "#00000020", justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor: "white", padding: 10, borderRadius: 5, width: "80%", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>{text}</Text>
        <ActivityIndicator size="large" color="#7496c4" />
      </View>
    </View>
  </Modal>
);

function getAddress(garage, command) {
  return garage.server.replace(/\/\s*$/, '') + '/garage/' + garage.number + '/' + command + '/' + garage.password;
}
