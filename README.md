# React Native Technical Task - Vocabo App

This project is a React Native mobile application built as part of a technical evaluation. It demonstrates a clean, feature-based modular architecture, reusable components, and smart abstractions for Firebase and API integration.

## 🚀 Objective
Build a robust mobile app using Firebase that follows best practices in software architecture and code quality.

## 🛠 Tech Stack
- **Framework**: React Native (TypeScript)
- **State Management**: React Hooks & Custom Hooks
- **Authentication**: Firebase (Email/Password, Google Sign-In)
- **Database**: Firestore (Configured)
- **API**: JSONPlaceholder
- **Storage**: AsyncStorage (for offline caching)
- **Navigation**: React Navigation (Stack)

## 🧱 Architecture
The app follows a **Feature-based Modular Architecture**:
- `src/core/`: Global configurations, types, and universal utilities.
- `src/features/`: Independent modules (Auth, Posts) containing their own API logic, hooks, and screens.
- `src/shared/`: Reusable UI components (Button, Input, Card) and global layouts.
- `src/navigation/`: App-wide navigation logic.

### 🔁 Smart Abstractions
- `useAuth`: Centralized authentication logic abstracting Firebase.
- `usePosts`: Data fetching hook with built-in **Offline Caching** and memory-based caching (5-minute TTL).
- `storage`: Utility wrapper for `AsyncStorage`.

## ✨ Features
- [x] **Email & Password Auth**: Secure login via Firebase.
- [x] **Google Sign-In**: Integrated social login.
- [x] **Post List**: Scrollable list with Pull-to-Refresh.
- [x] **Post Detail**: Detailed view with likes and comments interaction.
- [x] **Offline Support**: Posts are cached locally for viewing without internet access.
- [x] **Error Boundary**: Robust handling of unexpected application errors.

## 📦 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd TECHNICAL_TASK
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Node Version**:
   This project requires Node.js `^20.19.0 || ^22.13.0 || >=24`. Use the included `.nvmrc`:
   ```bash
   nvm use
   ```

4. **Android Setup**:
   - Ensure `google-services.json` is in `android/app/`.
   - Run `yarn android`.

5. **iOS Setup**:
   - `cd ios && pod install && cd ..`
   - Run `yarn ios`.

## 🧠 Development Flow
The development followed a strict git workflow with clear, atomic commits focusing on:
1. Environment stability (Node versioning).
2. Infrastructure setup (Navigation, Firebase).
3. Component-driven development.
4. Logic abstraction via Hooks.
5. Robustness & Bonus features (Caching, Error Boundaries).
