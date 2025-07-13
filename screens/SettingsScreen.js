import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme, notificationsEnabled, toggleNotifications, logout } = useTasks();
  const styles = getStyles(theme);

  const handleLogout = () => {
    Alert.alert( "Log Out", "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out", style: "destructive",
          onPress: async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Feather name="arrow-left" size={24} color={styles.headerText.color} />
              </TouchableOpacity>
              <Text style={styles.headerText}>Settings</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Feather name={theme === 'dark' ? 'moon' : 'sun'} size={20} color={styles.settingLabel.color} />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'} onValueChange={toggleTheme} value={theme === 'dark'} />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Feather name={notificationsEnabled ? 'bell' : 'bell-off'} size={20} color={styles.settingLabel.color} />
                <Text style={styles.settingLabel}>Enable Notifications</Text>
              </View>
              <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'} onValueChange={toggleNotifications} value={notificationsEnabled} />
            </View>
            <Text style={styles.settingDescription}>(This is a UI toggle for demonstration.)</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={20} color="#FF3B30" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>

        {/* THE FIX: Developer credit added at the bottom */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Developed with ❤️ by Rik</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#000000' : '#F0F2F5', paddingTop: Platform.OS === 'android' ? 25 : 0 },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginBottom: 20, },
  backButton: { padding: 5, },
  headerText: { fontSize: 22, fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A', marginLeft: 15, },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFFFFF', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, },
  settingTextContainer: { flexDirection: 'row', alignItems: 'center', },
  settingLabel: { fontSize: 16, color: theme === 'dark' ? '#EAEAEA' : '#333', marginLeft: 15, },
  settingDescription: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 5, paddingHorizontal: 10, },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, backgroundColor: theme === 'dark' ? '#2c1a1a' : '#ffebee', paddingVertical: 15, borderRadius: 10, borderWidth: 1, borderColor: '#FF3B30', },
  logoutButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', marginLeft: 10, },
  footer: { paddingBottom: 30, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#8E8E93' },
});