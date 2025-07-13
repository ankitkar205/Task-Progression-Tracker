import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const INITIAL_TASKS = [
  { id: 't1', title: 'Welcome to your To-Do App!', subtitle: 'Tap the circle to complete me.', time: new Date(Date.now() + 10 * 60 * 1000).toISOString(), status: 'not_started', priority: 'High' },
];
const INITIAL_STUDY_SUBJECTS = [
    { id: 's1', title: 'React Native Course', status: 'paused', totalTime: 3660, startTime: null, history: [{ date: new Date().toISOString(), seconds: 3660 }] },
];

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [studySubjects, setStudySubjects] = useState([]);
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('tasks');
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedStudySubjects = await AsyncStorage.getItem('studySubjects');
        const savedNotifPref = await AsyncStorage.getItem('notificationsEnabled');

        setTasks(savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS);
        setTheme(savedTheme || 'light');
        setStudySubjects(savedStudySubjects ? JSON.parse(savedStudySubjects) : INITIAL_STUDY_SUBJECTS);
        setNotificationsEnabled(savedNotifPref !== null ? JSON.parse(savedNotifPref) : true);
      } catch (e) {
        console.error("Failed to load data from storage", e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadDataFromStorage();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      AsyncStorage.setItem('theme', theme);
      AsyncStorage.setItem('studySubjects', JSON.stringify(studySubjects));
      AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    }
  }, [tasks, theme, studySubjects, notificationsEnabled, isDataLoaded]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);
  
  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, { ...newTask, status: 'not_started', id: `t_${Date.now()}` }]);
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure?", [{ text: "Cancel" }, { text: "Delete", onPress: () => setTasks(prev => prev.filter(task => task.id !== id)) }]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  const scheduleTaskReminder = async (task) => {
    if (!notificationsEnabled) {
      console.log("Notifications are disabled. Reminder not set.");
      return;
    }
    try {
      const trigger = task.time;
      if (trigger.getTime() > Date.now()) {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Task Reminder! ⏰", body: task.title, data: { taskId: task.id } },
          trigger,
        });
      }
    } catch (e) { console.error("Failed to schedule notification", e); }
  };

  const addStudySubject = (title) => {
    if(!title || title.trim() === "") return;
    const newSubject = { id: `s_${Date.now()}`, title, status: 'paused', totalTime: 0, startTime: null, history: [] };
    setStudySubjects(prev => [...prev, newSubject]);
  };

  const deleteStudySubject = (id) => {
    Alert.alert("Delete Subject", "Are you sure?", [{ text: "Cancel" }, { text: "Delete", onPress: () => setStudySubjects(prev => prev.filter(s => s.id !== id)) }]);
  };

  const toggleStudyStatus = (id) => {
    setStudySubjects(prev => prev.map(subject => {
      if (subject.id === id) {
        if (subject.status === 'ongoing') {
          const elapsed = Math.round((Date.now() - subject.startTime) / 1000);
          return { ...subject, status: 'paused', totalTime: subject.totalTime + elapsed, startTime: null, history: [...subject.history, { date: new Date().toISOString(), seconds: elapsed }] };
        }
        return { ...subject, status: 'ongoing', startTime: Date.now() };
      }
      return subject;
    }));
  };
  
  const addManualTime = (id, secondsToAdd) => {
    setStudySubjects(prev => prev.map(subject => {
      if (subject.id === id) {
        return { ...subject, totalTime: subject.totalTime + secondsToAdd, history: [...subject.history, { date: new Date().toISOString(), seconds: secondsToAdd, manual: true }] };
      }
      return subject;
    }));
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['username', 'tasks', 'theme', 'studySubjects', 'notificationsEnabled']);
    } catch (e) {
      console.error("Failed to clear data on logout", e);
    }
  };
  
  const value = {
    tasks, addTask, deleteTask, updateTaskStatus,
    theme, toggleTheme,
    notificationsEnabled, toggleNotifications,
    studySubjects, addStudySubject, deleteStudySubject, toggleStudyStatus, addManualTime,
    logout, isDataLoaded, scheduleTaskReminder,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => useContext(TaskContext);