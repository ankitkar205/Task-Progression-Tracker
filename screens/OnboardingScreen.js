import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.playBtn}>
          <Text style={styles.playText}>▶</Text>
          <Text style={styles.playLabel}>
            How it <Text style={{ color: '#ff6347' }}>works</Text>
          </Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/onboarding.png')} // Replace with your image
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.heading}>Manage Your{'\n'}Everyday task list</Text>
        <Text style={styles.subheading}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        </Text>

        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={() => navigation.navigate('Dashboard')} // 👈 THIS sends you to Dashboard
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Optional: dots indicator */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3FF',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    marginTop: 60,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playText: {
    fontSize: 18,
    marginRight: 6,
    color: '#000',
  },
  playLabel: {
    fontSize: 16,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 300,
  },
  bottom: {
    alignItems: 'center',
    marginBottom: 60,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 30,
  },
  getStartedBtn: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#FF6347',
    width: 10,
    height: 10,
  },
})
