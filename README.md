
# 📱 Charity Mobile App

## Project Overview

The **Charity Mobile App** is a sophisticated, feature-rich mobile application built to complement a charity's web platform. This app empowers volunteers and donors with a seamless, on-the-go experience for managing events, projects, and donations.

Our goal was to create a robust and intuitive mobile presence that fosters real-time engagement and collaboration.

This project serves as an excellent demonstration of building a full-stack mobile solution with a strong focus on:

- Type safety  
- Secure API communication  
- Responsive user experience  

---

## ✨ Features

### ✅ Event Management
Users can view detailed information for upcoming events, including:

- Title
- Date
- Location
- Full description

Authenticated users can sign up for events directly from their device.

### 🔐 User Authentication
A secure and reliable system for:

- User registration
- User login
- Protection of all user data

### 🔗 Comprehensive API Service Layer
A centralized API service handles all backend communication, including:

- User management
- Events
- Projects
- Donations
- Partnership proposals

An integrated Axios interceptor automatically attaches the user's authentication token to every request for seamless and secure API calls.

### 🔔 Real-time Notifications
Push notifications keep users updated with:

- Event reminders
- Donation confirmations
- Other important announcements

Implemented using **Expo Push Notifications**.

### 🧱 Data Modeling
Robust, well-defined data modeling using **TypeScript** ensures:

- Code consistency
- Type safety across the entire app

### 📊 Project and Donation Tracking
The app allows users to:

- Browse active projects
- View project details
- Make secure donations

---

## 🛠️ Technology Stack

| Category         | Tech Used                     |
|------------------|-------------------------------|
| **Framework**    | React Native                  |
| **Language**     | TypeScript                    |
| **State Management** | (React Context) |
| **API Client**   | Axios                         |
| **Notifications**| Expo Push Notifications       |
| **Styling**      | (Nativewindcss) |

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher recommended)  
- npm or yarn  
- Expo CLI  

Install Expo CLI globally:

```bash
npm install -g expo-cli
```

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/vanheaven-ui/charity-mobile.git
cd charity-mobile
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory and define your environment variables (e.g., API base URL):

```env
API_BASE_URL=https://your-api-url.com
```

4. **Start the Expo development server**

```bash
npm start
```

This will launch the Expo development server and provide you with a **QR code**.

You can:

- Scan it using the **Expo Go app** on your mobile device  
- Or run the app on an **iOS/Android emulator**

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository  
2. **Create** a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes** and commit:

```bash
git commit -m 'feat: Add new feature'
```

4. **Push to GitHub**:

```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request** with a clear and descriptive summary of your changes

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

