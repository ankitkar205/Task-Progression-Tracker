import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
import { useTasks } from '../context/TaskContext';
import ManualTimeEntryModal from '../components/ManualTimeEntryModal';

const screenWidth = Dimensions.get('window').width;
const formatTime = (s) => s >= 0 ? new Date(s * 1000).toISOString().slice(11, 19) : "00:00:00";
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

export default function ProgressScreen({ navigation }) {
    const { theme, studySubjects, addManualTime } = useTasks();
    const styles = getStyles(theme);
    const DAILY_GOAL_SECONDS = 4 * 60 * 60;

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const weeklyChartData = useMemo(() => {
        const labels = [];
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2));
            let totalSecondsForDay = 0;
            studySubjects.forEach(subject => subject.history.forEach(session => {
                if (new Date(session.date).toDateString() === day.toDateString()) {
                    totalSecondsForDay += session.seconds;
                }
            }));
            data.push(+(totalSecondsForDay / 3600).toFixed(1));
        }
        return { labels, datasets: [{ data, strokeWidth: 3 }], totalTodaySeconds: data[6] * 3600 };
    }, [studySubjects]);

    const pieChartData = useMemo(() => {
        const filteredSubjects = studySubjects.filter(s => s.totalTime > 0);
        if (filteredSubjects.length === 0) {
            return [{ name: "No Data", population: 1, color: '#E0E0E0', legendFontColor: '#A0A0A0', legendFontSize: 14 }];
        }
        return filteredSubjects.map(subject => ({
            name: subject.title,
            population: subject.totalTime,
            color: getRandomColor(),
            legendFontColor: theme === 'dark' ? '#FFF' : '#333',
            legendFontSize: 14,
        }));
    }, [studySubjects, theme]);
    
    const progress = DAILY_GOAL_SECONDS > 0 ? Math.min(weeklyChartData.totalTodaySeconds / DAILY_GOAL_SECONDS, 1) : 0;

    const handleOpenModal = (subject) => { setSelectedSubject(subject); setModalVisible(true); };
    const handleCloseModal = () => { setModalVisible(false); setSelectedSubject(null); };
    const handleSaveTime = (minutes) => { if (selectedSubject && minutes > 0) addManualTime(selectedSubject.id, minutes * 60); };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Feather name="arrow-left" size={24} color={styles.headerText.color} /></TouchableOpacity>
                <Text style={styles.headerText}>Progress Dashboard</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Daily Goal</Text>
                    <View style={styles.dailyGoalContent}>
                        <Progress.Circle size={120} progress={progress} showsText={true} formatText={() => `${Math.floor(progress * 100)}%`} color={'#FF6347'} unfilledColor={theme === 'dark' ? '#3A3A3C' : '#F0F2F5'} borderColor={'transparent'} textStyle={styles.progressText} thickness={10}/>
                        <View style={styles.dailyGoalInfo}><Text style={styles.summaryLabel}>Today's Progress</Text><Text style={styles.summaryValue}>{formatTime(weeklyChartData.totalTodaySeconds)}</Text><Text style={styles.summaryGoal}>Goal: {formatTime(DAILY_GOAL_SECONDS)}</Text></View>
                    </View>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Weekly Trend (Hours)</Text>
                    <LineChart data={weeklyChartData} width={screenWidth - 60} height={220} yAxisSuffix="h" fromZero={true} chartConfig={{
                        backgroundColor: 'transparent', backgroundGradientFrom: theme === 'dark' ? '#1C1C1E' : '#FFFFFF', backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: theme === 'dark' ? '#1C1C1E' : '#FFFFFF', backgroundGradientToOpacity: 0,
                        decimalPlaces: 1, color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
                        labelColor: (opacity = 1) => theme === 'dark' ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                        propsForDots: { r: "5", strokeWidth: "2", stroke: "#ffa726" },
                        propsForBackgroundLines: { stroke: theme === 'dark' ? '#2A2A2A' : '#EAEAEA' }
                    }} bezier style={{ borderRadius: 16 }}/>
                </View>
                
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Subject Breakdown</Text>
                    <PieChart data={pieChartData} width={screenWidth - 40} height={220} chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} center={[10, 0]} absolute/>
                </View>

                {/* THE FIX: The list of subjects is now back, below the charts */}
                <View style={styles.listContainer}>
                    <Text style={styles.chartTitle}>All Subjects</Text>
                    <Text style={styles.listSubtitle}>Tap any subject to add time manually.</Text>
                    {studySubjects.length > 0 ? studySubjects.map(subject => (
                        <TouchableOpacity key={subject.id} onPress={() => handleOpenModal(subject)}>
                            <View style={styles.subjectCard}>
                                <Text style={styles.subjectTitle}>{subject.title}</Text>
                                <Text style={styles.subjectTime}>{formatTime(subject.totalTime)}</Text>
                            </View>
                        </TouchableOpacity>
                    )) : <Text style={styles.emptyText}>No subjects tracked yet.</Text>}
                </View>

            </ScrollView>
            {selectedSubject && (
                <ManualTimeEntryModal isVisible={isModalVisible} onClose={handleCloseModal} onSave={handleSaveTime} subjectTitle={selectedSubject.title} theme={theme}/>
            )}
        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#F0F2F5', paddingTop: Platform.OS === 'android' ? 25 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  backButton: { padding: 5, marginRight: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  chartCard: { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000', marginBottom: 15, alignSelf: 'flex-start' },
  dailyGoalContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  dailyGoalInfo: { alignItems: 'flex-start', marginLeft: 20 },
  summaryLabel: { fontSize: 16, color: theme === 'dark' ? '#A0A0A0' : '#555', fontWeight: '600' },
  summaryValue: { fontSize: 28, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000', marginTop: 8 },
  summaryGoal: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  progressText: { fontSize: 20, fontWeight: 'bold', color: theme === 'dark' ? '#FFF' : '#000' },
  emptyText: { textAlign: 'center', marginVertical: 20, color: '#999' },

  // --- NEW STYLES for the list section ---
  listContainer: {
    marginBottom: 20,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
    marginTop: -10,
  },
  subjectCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1C1C1E' : '#FFF',
    padding: 20, borderRadius: 12, marginBottom: 10,
  },
  subjectTitle: { fontSize: 16, fontWeight: '500', color: theme === 'dark' ? '#FFF' : '#000' },
  subjectTime: { fontSize: 16, color: '#FF6347', fontWeight: 'bold' },
});