import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';

export default function AddTaskScreen({ navigation }) {
  // THE FIX: Get the new scheduleTaskReminder function from the context
  const { addTask, theme, scheduleTaskReminder } = useTasks();
  const styles = getStyles(theme);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  // Set default time to 5 minutes in the future to ensure it's a valid notification time
  const [time, setTime] = useState(new Date(Date.now() + 5 * 60 * 1000));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState('Low');

  // THE FIX: The save handler must be async to use 'await'
  const handleSave = async () => {
    if (!title.trim()) { 
      alert('Please enter a task title.'); 
      return; 
    }
    
    // Check if the selected time is in the past
    if (time.getTime() <= Date.now()) {
      alert("Please select a future time for the reminder.");
      return;
    }

    // This is the complete task object that will be saved
    const newTask = {
      id: Date.now().toString(),
      title,
      subtitle,
      // Save the time as an ISO string for reliable data persistence and retrieval
      time: time.toISOString(), 
      priority,
    };
    
    // 1. Add the task to our global state
    addTask(newTask);

    // 2. Schedule the notification. We pass the original Date object for accuracy.
    await scheduleTaskReminder({ ...newTask, time: time });
    
    // 3. Go back to the dashboard
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Feather name="arrow-left" size={24} color={styles.label.color} /></TouchableOpacity></View>
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Add New Task</Text>
            <Text style={styles.label}>Task Title</Text>
            <TextInput placeholder="e.g., Morning workout" style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={theme === 'dark' ? '#8E8E93' : '#AEAEB2'}/>
            <Text style={styles.label}>Subtitle</Text>
            <TextInput placeholder="e.g., At the gym" style={styles.input} value={subtitle} onChangeText={setSubtitle} placeholderTextColor={theme === 'dark' ? '#8E8E93' : '#AEAEB2'}/>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}><Text style={styles.inputText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></TouchableOpacity>
            {showTimePicker && <DateTimePicker value={time} mode="time" display="spinner" onChange={(e,d) => { setShowTimePicker(Platform.OS === 'ios'); if (d) setTime(d); }} themeVariant={theme} />}
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
            {['Low', 'Medium', 'High'].map((p) => (
                <TouchableOpacity key={p} style={[styles.priorityBtn, styles[`priorityBtn${p}`], p === priority && styles[`priorityBtnActive${p}`]]} onPress={() => setPriority(p)}>
                    <Text style={[styles.priorityText, p === priority && styles.priorityTextActive]}>{p}</Text>
                </TouchableOpacity>
            ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Save Task</Text></TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
}

// All the styles you provided are correct and remain the same.
const getStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#F0F2F5' },
  header: { paddingLeft: 20, paddingTop: 10 },
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: theme === 'dark' ? '#FFF' : '#000' },
  label: { fontSize: 16, fontWeight: '600', color: theme === 'dark' ? '#EAEAEA' : '#555', marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF', color: theme === 'dark' ? '#FFF' : '#000', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: theme === 'dark' ? '#3A3A3C' : '#E0E0E0' },
  inputText: { fontSize: 16, color: theme === 'dark' ? '#FFF' : '#000' },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  priorityBtn: { flex: 1, borderWidth: 2, borderRadius: 10, paddingVertical: 10, marginHorizontal: 5, alignItems: 'center', backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF' },
  priorityText: { fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000' },
  priorityTextActive: { color: '#fff' },
  priorityBtnLow: { borderColor: '#34C759' }, priorityBtnActiveLow: { backgroundColor: '#34C759' },
  priorityBtnMedium: { borderColor: '#FF9500' }, priorityBtnActiveMedium: { backgroundColor: '#FF9500' },
  priorityBtnHigh: { borderColor: '#FF3B30' }, priorityBtnActiveHigh: { backgroundColor: '#FF3B30' },
  saveBtn: { backgroundColor: '#FF6347', marginTop: 40, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});