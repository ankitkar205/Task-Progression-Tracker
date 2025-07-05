import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from './screens/OnboardingScreen'
import DashboardScreen from './screens/DashboardScreen' // 👈 Add this

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} /> {/* 👈 Added here */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
