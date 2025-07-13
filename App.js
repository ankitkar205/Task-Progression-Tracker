import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- NEW IMPORTS FOR NOTIFICATIONS ---
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
// --- END NEW IMPORTS ---

import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import SignupScreen from './screens/SignupScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProgressScreen from './screens/ProgressScreen';
import AddStudySubjectScreen from './screens/AddStudySubjectScreen';
import { TaskProvider } from './context/TaskContext';

const Stack = createNativeStackNavigator();

// --- NEW NOTIFICATION HANDLER CONFIG ---
// This configures how notifications appear when the app is already open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
// --- END NEW CONFIG ---

// A simple loading screen while we check device storage
const SplashScreen = () => (
  <View style={styles.splashContainer}><ActivityIndicator size="large" color="#FF6347" /></View>
);

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  // This function requests permission to send notifications
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // You can optionally show an alert here if permission is denied
        // alert('Notifications permission denied!');
        return;
      }
    } else {
      // alert('Must use physical device for Push Notifications');
    }
  }

  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        // 1. Ask for notification permissions
        await registerForPushNotificationsAsync();

        // 2. Check for a saved user
        const username = await AsyncStorage.getItem('username');
        setInitialRoute(username ? 'Dashboard' : 'Onboarding');
      } catch (e) {
        console.error("App bootstrap error:", e);
        setInitialRoute('Onboarding'); // Default to Onboarding on any error
      }
    };

    bootstrapApp();
  }, []);

  if (!initialRoute) {
    return <SplashScreen />;
  }

  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="AddStudySubject" component={AddStudySubjectScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F2F5' },
});