# User Management and Communication Platform (UMCP)

A complete web application for students, alumni, and administrators to connect, share opportunities, and communicate.

##  Features

### Authentication & Security
-  Email/password authentication with Firebase Auth
-  Email verification flow
-  Password reset functionality
-  Two-factor authentication (2FA) placeholder
-  Role-based access control (Student/Alumni/Admin)
-  Session management with Redux

### User Profiles
-  Profile editing with photo uploads
-  LinkedIn OAuth integration (demo)
-  Bio, headline, and personal information
-  File storage with Firebase Storage

### Posts System
-  CRUD operations for Jobs/Internships/Mentorships/Announcements
-  Rich text editor (TipTap)
-  Scheduling and expiration dates
-  View analytics and tracking
-  Draft support
-  Content filtering and moderation
-  Tag system

### Communication
-  Real-time messaging with Firebase Firestore
-  File sharing in messages
-  Threaded conversations
-  Message history

### Notifications
-  In-app notifications system
-  Firebase Cloud Messaging (FCM) integration
-  Real-time notification updates
-  Email notifications

### Security & Moderation
-  Content reporting system
-  Admin review and approval workflow
-  User role management
-  Account suspension/reactivation
-  Profanity filtering

### Admin Panel
-  User management (roles, suspension)
-  Post approvals and moderation
-  Reports review and resolution
-  Analytics dashboard
-  Bulk actions

### Role-Specific Dashboards
-  Student Dashboard
-  Alumni Dashboard
-  Admin Dashboard

##  Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router v7** for routing
- **React Hook Form** with Zod validation
- **TipTap** for rich text editing
- **Firebase SDK** for client-side integration

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Admin SDK** for server-side operations
- **Firebase Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Auth** for authentication
- **Firebase Cloud Messaging** for notifications

### Database & Storage
- **Firebase Firestore** (NoSQL database)
- **Firebase Storage** (file storage)
- **Firebase Auth** (authentication)

##  Project Structure


umcp/
 frontend/                 # React frontend application
    src/
       components/       # Reusable UI components
       features/         # Redux slices and feature logic
       pages/           # Page components
       routes/          # Routing configuration
       store/           # Redux store setup
       lib/             # Utility libraries
    public/              # Static assets
    package.json
 server/                  # Express backend API
    src/
       index.ts         # Main server file
    package.json
 firebase.json            # Firebase configuration
 README.md


##  Features Overview

### For Students
- Browse and apply to job/internship postings
- Connect with alumni for mentorship
- Access announcements and updates
- Real-time messaging with alumni
- Profile management with resume uploads

### For Alumni
- Post job/internship opportunities
- Offer mentorship to students
- Share announcements and updates
- Communicate with students
- Manage professional profile

### For Administrators
- Moderate content and user activity
- Manage user roles and permissions
- Review and approve posts
- Handle reports and violations
- Access analytics and insights

##  Security Features

- Firebase Authentication with email verification
- Role-based access control
- Content moderation and reporting
- Profanity filtering
- Secure file uploads
- Protected API endpoints
- Session management

