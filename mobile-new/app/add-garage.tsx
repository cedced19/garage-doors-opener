import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { GlobalContext } from './lib/global-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Utility functions
function makeId() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: 5}, () => 
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join('');
}

function isUrl(url) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}

function checkEmptyProperties(state) {
  for (const k in state) {
    if (state[k] === '' && k !== 'closed') {
      return k;
    }
  }
  return false;
}

export default function EditScreen() {
  const { currentGarage, garageDefined, defineCurrentGarage, removeCurrentGarage, garages, setGarages } = useContext(GlobalContext);
  const [server, setServer] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [number, setNumber] = useState('');
  const [id, setId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (garageDefined) {
      loadExistingGarage(currentGarage);
    } else {
      // Generate new ID for new garage
      setId(makeId());
    }
  }, []);

  const loadExistingGarage = (garage) => {
          setServer(garage.server);
          setPassword(garage.password);
          setNickname(garage.nickname);
          setNumber(garage.number);
          setId(garage.id);
  };

  const saveConfig = async () => {
    // Validation
    const emptyProperty = checkEmptyProperties({ server, password, nickname, number });
    if (emptyProperty) {
      Alert.alert('Error', `Please fill in the ${emptyProperty} field`);
      return;
    }

    if (isNaN(Number(number))) {
      Alert.alert('Error', 'Invalid garage number');
      return;
    }

    if (!isUrl(server)) {
      Alert.alert('Error', 'Invalid server address');
      return;
    }

    try {
      // Retrieve existing garages
      const data = await AsyncStorage.getItem('garages');
      let parsed = data ? JSON.parse(data) : [];

      // Prepare garage object
      const garageData = { server, password, nickname, number, id };

      // Update or add garage
      if (garageDefined) {
        // Update existing garage
        parsed = parsed.map(g => g.id === currentGarage.id ? garageData : g);
      } else {
        // Add new garage
        parsed.push(garageData);
      }

      // Save updated garages
      await AsyncStorage.setItem('garages', JSON.stringify(parsed));
      removeCurrentGarage();
      router.replace('/');

    } catch (error) {
      Alert.alert('Error', 'Failed to save garage configuration');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#5880b7" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Server Address</Text>
          <TextInput
            style={styles.input}
            value={server}
            onChangeText={setServer}
            placeholder="Enter server address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
          />

          <Text style={styles.label}>Garage Number</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder="Enter garage number"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter garage nickname"
          />

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={saveConfig}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#7496c4',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});