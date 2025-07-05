import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'

export default function DashboardScreen() {
  const todayTasks = [
    { id: '1', title: 'Lunch with client', subtitle: 'Ask Secretary', time: '10:30 AM' },
    { id: '2', title: 'Check Emails', subtitle: 'Open PC', time: '01:45 PM' },
    { id: '3', title: 'Lunch with client', subtitle: 'Lunch Reminder', time: '03:31 PM' },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello Mohin</Text>
        <Text style={styles.subtext}>25 Task are pending</Text>
        <View style={styles.icons}>
          <Ionicons name="menu-outline" size={24} color="#333" />
          <Feather name="search" size={24} color="#333" style={{ marginLeft: 10 }} />
        </View>
      </View>

      <View style={styles.searchSection}>
        <TextInput style={styles.searchInput} placeholder="Search Courses" />
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Ongoing Task</Text>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>Space App Design</Text>
        <Text style={styles.taskSubtext}>Team Member</Text>
        <Text style={styles.taskTime}>10:30 am to 01:30 pm</Text>
      </View>

      <Text style={styles.sectionTitle}>Today’s Task</Text>
      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <Text style={styles.timelineTitle}>{item.title}</Text>
            <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
            <Text style={styles.timelineTime}>{item.time}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add New Task</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FD',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    color: '#888',
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  searchSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  filterBtn: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskSubtext: {
    color: '#666',
    marginTop: 4,
  },
  taskTime: {
    marginTop: 10,
    color: '#FF6347',
  },
  timelineItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  timelineTitle: {
    fontWeight: 'bold',
    color: '#444',
  },
  timelineSubtitle: {
    color: '#777',
  },
  timelineTime: {
    marginTop: 4,
    fontSize: 12,
    color: '#aaa',
  },
  addBtn: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 30,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
