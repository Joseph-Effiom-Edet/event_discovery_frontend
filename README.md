"""# Local Event Finder - Frontend

This directory contains the React Native (Expo) mobile application frontend for the Local Event Finder.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installation](#installation)
  - [Backend Connection](#backend-connection)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Key Components & Screens](#key-components--screens)
- [Dependencies](#dependencies)
- [Scripts](#scripts)

## Description

The frontend is a cross-platform mobile application built using React Native and the Expo framework. It allows users to discover local events, view details, browse categories, see events on a map or calendar, register for events, manage their profile, and bookmark events they are interested in. It utilizes Expo Router for file-based routing.

## Features

-   Event discovery feed with filtering (category, location radius).
-   Event detail view.
-   Map view showing event locations (Native only).
-   Calendar view showing event dates.
-   User authentication (Login/Register).
-   User profile management (view, edit details, change password).
-   View registered events (Upcoming/Past).
-   View bookmarked events.
-   Event registration and cancellation.
-   Event bookmarking.

## Tech Stack

-   **Framework:** React Native / Expo SDK (~52)
-   **Routing:** Expo Router (~4)
-   **HTTP Client:** Axios
-   **UI Components:** React Native core components, `react-native-calendars`, `react-native-maps`, `@react-native-community/slider`
-   **State Management:** React Context API (`AuthContext`, `LocationContext`)
-   **Icons:** `@expo/vector-icons` (Feather, MaterialCommunityIcons)
-   **Utilities:** `date-fns` (Date formatting/manipulation), `expo-location` (Location services), `@react-native-async-storage/async-storage` (Token storage)

## Prerequisites

-   Node.js (LTS version recommended)
-   npm or Yarn
-   Git
-   Expo Go app installed on your iOS or Android device (for testing on physical devices).
-   (Optional) Android Studio / Xcode for running on emulators/simulators.
-   Expo CLI (Install globally if needed: `npm install -g expo-cli`)

## Getting Started

### Cloning the Repository

```bash
# If you haven't already cloned the main project
git clone <repository_url>
cd LocalEventFinder-1/frontend
```

### Installation

Install the required dependencies using npm or yarn:

```bash
npm install
# OR
yarn install
```

### Backend Connection

The frontend is configured to connect to the backend API specified in `frontend/services/api.js`.

-   **Default:** It points to the deployed backend URL: `https://event-discovery-backend.onrender.com/api`.
-   **Local Development:** If you are running the backend locally (e.g., on `http://localhost:8000`), you **must** update the `API_BASE_URL` constant in `frontend/services/api.js` to point to your local backend URL (or use a tool like ngrok and update the URL accordingly).

### Running the App

You can run the application on different platforms using the Expo CLI:

1.  **Start the Metro Bundler:**
    ```bash
    npx expo start
    ```

2.  **From the terminal menu:**
    -   Press `a` to run on an Android Emulator or connected device.
    -   Press `i` to run on an iOS Simulator or connected device (requires macOS).
    -   Press `w` to run in a web browser.
    -   Scan the QR code shown in the terminal using the Expo Go app on your physical Android or iOS device.

See the [Expo documentation](https://docs.expo.dev/get-started/create-a-project/#opening-the-app-on-your-phonetablet) for more details.

## Project Structure

```
frontend/
├── app/                # Expo Router file-based routes (screens and layouts)
│   ├── (tabs)/         # Layout for the main tab navigation
│   └── ...             # Other routes/screens
├── assets/             # Static assets like images, fonts
├── components/         # Reusable UI components (EventCard, CategoryFilter, etc.)
├── context/            # React Context providers (AuthContext, LocationContext)
├── navigation/         # (Potentially) Navigation related configurations (if not using Expo Router exclusively)
├── screens/            # Screen components (often used with traditional navigation, may overlap with app/)
├── services/           # API interaction logic (api.js, auth.js)
├── utils/              # Utility functions
├── .expo/              # Expo cache and configuration files (generated)
├── node_modules/       # Project dependencies (generated)
├── App.js              # Root component (often minimal with Expo Router)
├── app.json            # Expo configuration file
├── babel.config.js     # Babel configuration
├── package.json        # Project metadata and dependencies
├── README.md           # This file
└── ...                 # Other configuration files (.gitignore, etc.)
```

## Key Components & Screens

-   **`app/(tabs)`:** Defines the main tab navigation (Events, Map, Calendar, Profile).
-   **`screens/EventsScreen.js`:** Displays the list of events with filtering capabilities.
-   **`screens/EventDetailScreen.js`:** Shows detailed information about a single event, including registration and bookmarking.
-   **`screens/MapScreen.js`:** Displays events on a map (Native only).
-   **`screens/CalendarScreen.js`:** Shows a calendar view with events marked, allowing filtering by date.
-   **`screens/ProfileScreen.js`:** Allows users to view/edit their profile, see registered/bookmarked events, and logout.
-   **`screens/AuthScreen.js`:** Handles user login and registration.
-   **`components/EventCard.js`:** Reusable card component for displaying event summaries.
-   **`components/CategoryFilter.js`:** Horizontal filter for event categories.
-   **`components/LocationFilter.js`:** Toggle and slider for location-based filtering.
-   **`components/BookmarkButton.js`:** Reusable button for toggling event bookmarks.
-   **`context/AuthContext.js`:** Manages user authentication state.
-   **`context/LocationContext.js`:** Manages location permissions and data.
-   **`services/api.js`:** Centralized Axios instance and functions for backend communication.

## Dependencies

Key dependencies are listed in the [Tech Stack](#tech-stack) section. See `package.json` for the full list.

## Scripts

-   `npm start` or `yarn start`: Starts the Expo development server.
-   `npm run android` or `yarn android`: Starts the development server and attempts to launch on Android.
-   `npm run ios` or `yarn ios`: Starts the development server and attempts to launch on iOS.
-   `npm run web` or `yarn web`: Starts the development server and attempts to launch in a web browser.
"" 