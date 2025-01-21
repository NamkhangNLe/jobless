# Jobless 👋

Welcome to Jobless, an app designed to connect you with like-minded individuals for various activities and side quests.

## Get Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the App**

   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:

   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project Structure

- **app/**: Contains the main application code.
  - **_layout.tsx**: Root layout for the app.
  - **(tabs)/_layout.tsx**: Layout for the tab navigator.
  - **(tabs)/index.tsx**: Home screen.
  - **(tabs)/explore.tsx**: Explore screen.
  - **(tabs)/maps.tsx**: Maps screen.
  - **+not-found.tsx**: Not found screen.
- **components/**: Reusable UI components.
- **hooks/**: Custom hooks for the app.
- **assets/**: Static assets like images and fonts.
- **constants/**: Constant values used throughout the app.
- **models/**: TypeScript interfaces for data models.
- **scripts/**: Utility scripts for project maintenance.

## Features

- **Home Screen**: Welcome message and introduction to the app.
- **Explore Screen**: List of activities you have subscribed to and people who have subscribed to you.
- **Maps Screen**: Display of activities and subscriptions.
- **Themed Components**: Custom themed text and view components.
- **Parallax Scroll View**: Smooth scrolling with parallax effect.

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the Community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.