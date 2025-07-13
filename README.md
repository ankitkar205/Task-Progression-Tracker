# 🎯 To-Do & Progress Tracker: A React Native Showcase

This isn't just a to-do list. It's a full-featured productivity application built with React Native and Expo, designed to be both a powerful daily task manager and an intelligent progress tracker for your personal goals and studies.

 <!-- It's highly recommended to replace this with a real screenshot of your app! -->

---

## ✨ Core Features

This application was built from the ground up to include a robust set of features that mirror a professional, production-ready mobile app.

*   **Dual-Mode Functionality:** Seamlessly switch between two core modes on the main dashboard:
    *   **To-Do List:** A classic task manager for your daily errands and reminders.
    *   **Progress Tracker:** A specialized view for long-term goals or study subjects where you can track time spent.
*   **Persistent State:** The app remembers everything! Using `AsyncStorage`, your tasks, study subjects, theme preference, and login status are all saved locally on your device. Close the app and come back—your data will be exactly as you left it.
*   **Live Time Tracking:** For any "Progress" item, you can start a timer. The app will display a live, running clock (`HH:MM:SS`) for the current session and add it to the subject's total time when paused.
*   **Manual Time Entry:** Forgot to start the timer? No problem. Tap on any study subject to open a custom modal and manually add the hours and minutes you've studied.
*   **Data Visualization & Reporting:**
    *   A dedicated "Progress Dashboard" screen provides beautiful, graphical insights into your work.
    *   **Daily Goal Tracker:** A circular progress bar visualizes your progress towards a daily study goal.
    *   **Weekly Trend Chart:** A smooth, attractive Line Chart shows your study hours over the last 7 days.
    *   **Subject Breakdown:** A dynamic Pie Chart illustrates how your total study time is distributed across different subjects.
*   **Task Reminders & Notifications:** Schedule a reminder for any to-do task. The app uses `expo-notifications` to deliver a local notification at the specified time, even if the app is in the background.
*   **Full Theming Support:**
    *   Toggle between a beautiful Light Mode and a sleek Dark Mode from the Settings screen.
    *   The entire application UI, including charts and modals, is theme-aware.
*   **Robust Authentication Flow:**
    *   A smooth onboarding and signup process for new users.
    *   The app intelligently detects if a user is logged in and directs them straight to the main dashboard, bypassing the onboarding screens on subsequent launches.
    *   A secure "Logout" feature that clears user data and resets the app state.

---

## 🛠️ Tech Stack & Architecture

*   **Framework:** React Native with Expo
*   **State Management:** React Context API (for clean, centralized, app-wide state)
*   **Local Storage:** `@react-native-async-storage/async-storage` (for data persistence)
*   **Navigation:** React Navigation (Stack Navigator)
*   **Data Visualization:** `react-native-chart-kit` and `react-native-progress`
*   **Notifications:** `expo-notifications` and `expo-device`
*   **Icons:** `@expo/vector-icons` (Feather & Ionicons)

The architecture is built around a central `TaskContext`, which acts as a single source of truth for all user data. This makes the app scalable, easy to maintain, and ensures data consistency across all screens.

---

## 🚀 How to Run

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd [your-project-directory]
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the app using Expo Go:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app on your physical Android or iOS device. A physical device is required to test push notifications.

---

## ✍️ Author

Developed with ❤️ by **Ankit**.
