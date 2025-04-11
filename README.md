# Beekeeper Mobile App

A React Native mobile application built for beekeepers to manage hives and discover nearby crop pollination opportunities.

## Features

- **Hive Management**: Add, edit, and track beehives with unique identifiers
- **Colony Tracking**: Record the number of colonies in each hive
- **Location Services**: Automatically capture hive placement coordinates or manually search locations
- **Crop Opportunities**: Discover nearby crops that need pollination based on your location
- **Flowering Timelines**: View current and upcoming flowering windows for various crops
- **Offline Support**: Continue using the app without internet connection with local data storage
- **Search & Filtering**: Find hives quickly with search by ID and location radius filtering

## Tech Stack

- **React Native** with **Expo** framework
- **Expo Router** for file-based navigation
- **NativeWind** (TailwindCSS for React Native) for styling
- **React Native Async Storage** for local data persistence
- **Zustand** for state management

## Installation

1. Clone the repository:

```bash
git clone https://github.com/anujkumar09062001/BeeTrailFieldLogger.git
cd BeeTrailFieldLogger
```

2. Install dependencies:

```bash
npm install
```

3. Run the Android app:

```bash
npm run android
```

4. For iOS:

```bash
npm run ios
```

## App Structure

The app consists of several key screens:

- **My Hives Screen**: View all your registered hives
- **Add New Hive Screen**: Register new hives with identifier, colony count, and location
- **Crop Opportunities Screen**: Discover nearby pollination opportunities with flowering details

## Offline Support

The app includes offline capability with data synchronization when connection is restored. A banner will appear when the app is working in offline mode with a retry option to check connectivity.

## Location Access

The app requires location access to provide accurate hive placement and nearby crop information. If location access is denied, a fallback UI allows manual location search.

## Development

This project uses:

- Expo Router for file-based navigation
- NativeWind for styling (Tailwind CSS for React Native)
- React Native Async Storage for data persistence
- Zustand for state management
