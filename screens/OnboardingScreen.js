import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <Image
          source={require('../assets/onboarding.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.heading}>Manage Your Everyday Tasks</Text>
        <Text style={styles.subheading}>
          Plan, track, and accomplish your goals with ease.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, justifyContent: 'center', alignItems: 'center' },
    image: { width: '90%', height: 300, marginBottom: 30 },
    heading: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 15 },
    subheading: { fontSize: 16, color: '#777', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
    button: { backgroundColor: '#FF6347', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, elevation: 3 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});