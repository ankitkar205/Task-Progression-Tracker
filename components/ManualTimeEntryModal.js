import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ManualTimeEntryModal({ isVisible, onClose, onSave, subjectTitle, theme }) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const styles = getStyles(theme);

  const handleSave = () => {
    // Treat empty inputs as 0
    const numHours = parseInt(hours || '0', 10);
    const numMinutes = parseInt(minutes || '0', 10);

    if (isNaN(numHours) || isNaN(numMinutes)) {
      Alert.alert("Invalid Input", "Please enter valid numbers.");
      return;
    }

    const totalMinutes = (numHours * 60) + numMinutes;

    if (totalMinutes > 0) {
      onSave(totalMinutes);
      handleClose();
    } else {
      Alert.alert("No Time Entered", "Please enter a time greater than 0 minutes.");
    }
  };

  const handleClose = () => {
    setHours('');
    setMinutes('');
    Keyboard.dismiss();
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={24} color={styles.title.color} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Manual Time</Text>
          <Text style={styles.subtitle}>for "{subjectTitle}"</Text>
          
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="00"
              placeholderTextColor={theme === 'dark' ? '#666' : '#ccc'}
              keyboardType="number-pad"
              maxLength={2}
              value={hours}
              onChangeText={setHours}
              autoFocus={true}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={styles.input}
              placeholder="00"
              placeholderTextColor={theme === 'dark' ? '#666' : '#ccc'}
              keyboardType="number-pad"
              maxLength={2}
              value={minutes}
              onChangeText={setMinutes}
            />
          </View>
          <Text style={styles.inputLabel}>Hours : Minutes</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Time</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getStyles = (theme) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: { position: 'absolute', top: 15, right: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: theme === 'dark' ? '#FFFFFF' : '#000000' },
  subtitle: { fontSize: 14, color: '#8E8E93', marginBottom: 25 },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    width: 80,
    backgroundColor: theme === 'dark' ? '#3A3A3C' : '#F0F2F5',
    color: theme === 'dark' ? '#FFFFFF' : '#000000',
    borderRadius: 10,
    padding: 15,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: theme === 'dark' ? '#FFFFFF' : '#000000',
  },
  inputLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    marginBottom: 25,
  },
  saveButton: { backgroundColor: '#FF6347', borderRadius: 25, paddingVertical: 15, paddingHorizontal: 40, elevation: 2 },
  saveButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});