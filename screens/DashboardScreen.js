import React, { useState, useEffect } from 'react';
// THE FIX: Import Platform from react-native
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Reusable Components ---
const formatTime = (s) => s >= 0 ? new Date(s * 1000).toISOString().slice(11, 19) : "00:00:00";
const Timer = ({ startTime, style }) => {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setElapsed(Math.round((Date.now() - startTime) / 1000)), 1000);
        return () => clearInterval(interval);
    }, [startTime]);
    return <Text style={style}>Session: {formatTime(elapsed)}</Text>;
};

const StudyItem = ({ item, styles, toggleStudyStatus, deleteStudySubject, onManualAdd }) => (
    <TouchableOpacity onLongPress={onManualAdd} onPress={() => toggleStudyStatus(item.id)}>
        <View style={styles.taskCard}>
            <View style={styles.taskInfo}><Text style={styles.taskTitle}>{item.title}</Text><Text style={styles.taskTime}>Total: {formatTime(item.totalTime)}</Text>{item.status === 'ongoing' && <Timer startTime={item.startTime} style={styles.ongoingText} />}</View>
            <View style={styles.progressActions}>
                <Feather name={item.status === 'ongoing' ? 'pause-circle' : 'play-circle'} size={32} color={item.status === 'ongoing' ? '#FF9500' : '#007AFF'} />
                <TouchableOpacity onPress={(e) => { e.stopPropagation(); deleteStudySubject(item.id); }}><Feather name="trash-2" size={24} color="#FF3B30" /></TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
);

// THE ONLY CHANGE IS IN THIS COMPONENT
const TaskItem = ({ item, styles, deleteTask, updateTaskStatus }) => {
    // Convert the saved ISO string back into a readable time format for display
    const displayTime = new Date(item.time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={styles.taskCard}>
            <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, item.status === 'completed' && styles.taskTitleCompleted]}>{item.title}</Text>
                <Text style={[styles.taskSubtext, item.status === 'completed' && styles.taskTitleCompleted]}>{item.subtitle}</Text>
                {/* Use the formatted displayTime here instead of item.time */}
                <Text style={styles.taskTime}>{displayTime} - {item.priority} Priority</Text>
            </View>
            <View style={styles.taskActions}>
                {item.status !== 'completed' ? (
                    <TouchableOpacity onPress={() => updateTaskStatus(item.id, 'completed')}><Feather name="circle" size={24} color="#8E8E93" /></TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => updateTaskStatus(item.id, 'not_started')}><Feather name="check-circle" size={24} color="#34C759" /></TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteTask(item.id)}><Feather name="trash-2" size={24} color="#FF3B30" /></TouchableOpacity>
            </View>
        </View>
    );
};
// --- End of Reusable Components ---

export default function DashboardScreen({ navigation, route }) {
    const { tasks, deleteTask, updateTaskStatus, theme, studySubjects, addStudySubject, deleteStudySubject, toggleStudyStatus, addManualTime, isDataLoaded } = useTasks();
    const [username, setUsername] = useState('User'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState('todo');
    
    useEffect(() => {
        const loadUsername = async () => {
          const name = route.params?.username || await AsyncStorage.getItem('username');
          if (name) setUsername(name);
        };
        loadUsername();
    }, [route.params?.username]);

    const styles = getStyles(theme);

    if (!isDataLoaded) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF6347" />
                </View>
            </SafeAreaView>
        );
    }

    const handleAddPress = () => {
        if (activeView === 'todo') { navigation.navigate('AddTask'); } 
        else { navigation.navigate('AddStudySubject'); }
    };

    const handleManualTimeEntry = (id, title) => {
        Alert.prompt(`Add Manual Time to "${title}"`, "Enter time studied in MINUTES.",
            [{ text: "Cancel" }, { text: "Add", onPress: minutes => {
                const num = parseInt(minutes, 10);
                if (num > 0) { addManualTime(id, num * 60); } 
                else { Alert.alert("Invalid Input", "Please enter a valid number."); }
            }}], 'numeric'
        );
    };

    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View><View style={styles.greetingContainer}><Text style={styles.greeting}>Hello {username}</Text><View style={styles.notificationDot} /></View><Text style={styles.subtext}>{pendingTasksCount} tasks left today</Text></View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Ionicons name="menu-outline" size={28} color={styles.greeting.color} /></TouchableOpacity>
                </View>
                <View style={styles.searchSection}><TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={theme === 'dark' ? '#8E8E93' : '#AEAEB2'} value={searchQuery} onChangeText={setSearchQuery} /></View>
                <View style={styles.viewToggleContainer}>
                    <TouchableOpacity onPress={() => setActiveView('todo')} style={[styles.toggleButton, activeView === 'todo' && styles.toggleButtonActive]}><Text style={[styles.toggleButtonText, activeView === 'todo' && styles.toggleButtonTextActive]}>To-Do List</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveView('progress')} style={[styles.toggleButton, activeView === 'progress' && styles.toggleButtonActive]}><Text style={[styles.toggleButtonText, activeView === 'progress' && styles.toggleButtonTextActive]}>Progress Tracker</Text></TouchableOpacity>
                </View>
                {activeView === 'progress' && (<TouchableOpacity style={styles.progressLink} onPress={() => navigation.navigate('Progress')}><Text style={styles.progressLinkText}>View Detailed Summary</Text><Feather name="arrow-right" size={16} color="#FF6347" /></TouchableOpacity>)}
                <FlatList
                    data={activeView === 'todo' ? filteredTasks : studySubjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                    keyExtractor={(item) => item.id}
                    extraData={{ tasks, studySubjects, theme }} showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        if (activeView === 'todo') {
                            return <TaskItem item={item} styles={styles} deleteTask={deleteTask} updateTaskStatus={updateTaskStatus} />;
                        } else {
                            return <StudyItem item={item} styles={styles} toggleStudyStatus={toggleStudyStatus} deleteStudySubject={deleteStudySubject} onManualAdd={() => handleManualTimeEntry(item.id, item.title)} />;
                        }
                    }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No items yet. Tap '+' to add one!</Text>}
                    contentContainerStyle={{ paddingBottom: 150 }}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}><Feather name="plus" size={28} color="#fff" /></TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#F0F2F5', paddingTop: Platform.OS === 'android' ? 25 : 0 },
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    greetingContainer: { flexDirection: 'row', alignItems: 'center' },
    greeting: { fontSize: 28, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#1A1A1A' },
    notificationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', marginLeft: 5, marginBottom: 15 },
    subtext: { color: '#8E8E93', fontSize: 16, marginTop: 4 },
    searchSection: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
    searchInput: { flex: 1, backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF', color: theme === 'dark' ? '#FFF' : '#000', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: theme === 'dark' ? '#3A3A3C' : '#E0E0E0' },
    viewToggleContainer: { flexDirection: 'row', backgroundColor: theme === 'dark' ? '#1C1C1E' : '#E5E5EA', borderRadius: 10, padding: 3, marginBottom: 5 },
    toggleButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    toggleButtonActive: { backgroundColor: theme === 'dark' ? '#555' : '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    toggleButtonText: { fontWeight: '600', color: theme === 'dark' ? '#AAA' : '#8E8E93' },
    toggleButtonTextActive: { color: theme === 'dark' ? '#FFF' : '#000' },
    progressLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginBottom: 10, gap: 5 },
    progressLinkText: { color: '#FF6347', fontWeight: 'bold' },
    taskCard: { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: theme === 'dark' ? '#3A3A3C' : '#E0E0E0' },
    taskInfo: { flex: 1, marginRight: 10 },
    taskTitle: { fontSize: 16, fontWeight: '600', color: theme === 'dark' ? '#FFF' : '#1A1A1A' },
    taskTitleCompleted: { textDecorationLine: 'line-through', color: '#8E8E93' },
    taskSubtext: { color: '#8E8E93', marginTop: 4, fontSize: 14 },
    taskTime: { marginTop: 12, fontSize: 12, color: theme === 'dark' ? '#A0A0A0' : '#555', fontWeight: '500' },
    ongoingText: { color: '#34C759', fontSize: 12, fontWeight: 'bold', marginTop: 8 },
    taskActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    progressActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
    addBtn: { position: 'absolute', bottom: 40, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF6347', justifyContent: 'center', alignItems: 'center', elevation: 8 },
});