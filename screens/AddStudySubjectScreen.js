import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';

export default function AddStudySubjectScreen({ navigation }) {
  const { addStudySubject, theme } = useTasks();
  const [title, setTitle] = useState('');
  const styles = getStyles(theme);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a subject title.');
      return;
    }
    addStudySubject(title.trim());
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={styles.headerText.color} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Study Subject</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Subject Title</Text>
        <TextInput
          placeholder="e.g., Physics Chapter 3"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={theme === 'dark' ? '#8E8E93' : '#AEAEB2'}
          autoFocus={true}
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Add Subject</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#F0F2F5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { padding: 5, marginRight: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000' },
  container: { flex: 1, paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: '600', color: theme === 'dark' ? '#EAEAEA' : '#555', marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF',
    color: theme === 'dark' ? '#FFF' : '#000',
    paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, fontSize: 16,
    borderWidth: 1, borderColor: theme === 'dark' ? '#3A3A3C' : '#E0E0E0',
  },
  saveBtn: { backgroundColor: '#FF6347', marginTop: 40, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});