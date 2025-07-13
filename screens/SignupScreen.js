import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      try {
        await AsyncStorage.setItem('username', trimmedName);
        navigation.reset({ index: 0, routes: [{ name: 'Dashboard', params: { username: trimmedName } }] });
      } catch (e) {
        Alert.alert("Error", "Could not save your name. Please try again.");
      }
    } else {
      Alert.alert("Name Required", "Please enter your name.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What should we call you?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleContinue}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F2F5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', padding: 15, backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#FF6347', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});