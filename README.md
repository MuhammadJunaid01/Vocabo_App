# React Native Technical Task - Vocabo App

This project is a React Native mobile application built as part of a technical evaluation. It demonstrates a clean, feature-based modular architecture, reusable components, and smart abstractions for Firebase and API integration.

## 🚀 Objective
Build a robust mobile app using Firebase that follows best practices in software architecture, performance optimization, and code quality.

---

## 🏗 Architecture Explanation

The app follows a **Feature-based Modular Architecture**, emphasizing clear boundaries and separation of concerns. This makes the codebase highly scalable and predictable.

- **`src/core/`**: Global configurations, shared types, and universal utilities (e.g., `storage.ts` for AsyncStorage wrappers).
- **`src/features/`**: Independent, self-contained modules.
  - **`auth/`**: Contains its own API logic (`api.ts`), custom hooks (`useAuth`), components, and screens for Firebase Email/Password & Google Sign-In.
  - **`posts/`**: Contains data-fetching logic, offline infinite-scroll pagination (`usePosts`), and localized components (`PostCard.tsx`).
- **`src/shared/`**: Reusable "dumb" UI components designed for a premium look (Glassmorphism-styled `Card`, `Button`, `Input`).
- **`src/navigation/`**: Centralized routing using React Navigation (Stack).

### 🔁 Smart Abstractions & Custom Hooks
- **`useAuth`**: Centralized authentication logic abstracting away Firebase SDK specifics.
- **`usePosts`**: A robust data-fetching hook handling **Infinite Scrolling** (paginated fetching), detecting network status via `@react-native-community/netinfo`, and orchestrating smart **Offline Caching** (falling back to previously fetched data stored in `AsyncStorage`).

---

## 📦 Setup & Installation Instructions

Follow these steps to run the project locally.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MuhammadJunaid01/Vocabo_App.git
   cd Vocabo_App
   ```

2. **Configure Environment Variables**:
   - Create a `.env` file in the root directory (using `.env.example` as a template).
   - Add your Google Web Client ID for social login:
     ```env
     GOOGLE_WEB_CLIENT_ID=your_client_id_here
     ```

3. **Install dependencies**:
   Ensure you are using Node.js `^20.19.0 || ^22.13.0 || >=24` (you can use `nvm use` with the provided `.nvmrc`).
   ```bash
   yarn install
   ```

4. **Android Setup**:
   - Ensure your `google-services.json` is correctly placed in `android/app/`.
   - Run the app on an emulator or connected device:
     ```bash
     yarn android
     ```
   *(Note: If you run into CMake or native module caching issues, run `cd android && ./gradlew clean` before rebuilding).*

5. **iOS Setup**:
   - Install CocoaPods dependencies:
     ```bash
     cd ios && pod install && cd ..
     ```
   - Run the app on the iOS Simulator:
     ```bash
     yarn ios
     ```

---

## ✨ Core Features & Technical Highlights
- [x] **Firebase Auth**: Email & Password login + Google Sign-In integrated securely using `react-native-config`.
- [x] **Firestore Integration**: User comments are saved directly to a `comments` collection in Firebase.
- [x] **Performance Optimization**: `FlatList` optimized with `removeClippedSubviews`, `maxToRenderPerBatch`, and minimal re-renders.
- [x] **Offline Support**: Automatically detects when the device goes offline and seamlessly serves the last-loaded paginated dataset from `AsyncStorage`. Automatically refreshes upon reconnection.
- [x] **Premium UI**: Custom fonts, vector icons using `react-native-vector-icons`, and a modern design system.
- [x] **Error Boundaries**: App-level safety nets to catch unexpected crashes natively.

---

## 🤖 AI Usage & Assistance

This project was developed with thoughtful and transparent integration of AI coding assistants (like cursor/gemini):
- **Boilerplate & Utilities**: Used for rapidly generating standard configuration files (like `app.json`, `index.js`), boilerplate UI components, and TypeScript interfaces.
- **Complex Logic**: Guided the implementation of the complex `usePosts` infinite-scroll hook, combining NetInfo connectivity states and AsyncStorage fallback logic perfectly.
- **Debugging**: Utilized to rapidly diagnose native Android build failures (e.g., CMake caching issues, Google Sign-In SHA-1 mismatches, and Gradle configurations).
- **Design Inspiration**: Assisted in transitioning the UI from a basic layout to a "Premium" aesthetic using modern React Native styling techniques (drop shadows, responsive padding, customized vector icons).
