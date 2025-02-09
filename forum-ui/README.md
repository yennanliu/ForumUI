# Forum UI

A modern forum application built with Vue.js that allows users to participate in discussions across different topic boards.

## Features

- User authentication (register/login)
- Social authentication (Google, GitHub, Twitter, Facebook)
- Topic-based discussion boards
- Create and reply to posts
- User profiles
- Persistent data storage (localStorage)
- Responsive design
- Material Design icons

## Technology Stack

- Vue 3
- Vuex 4 (State Management)
- Vue Router 4
- Firebase Authentication
- Material Design Icons
- Local Storage for data persistence

## Project Setup

```bash
# Install dependencies
npm install

# Create .env file and add your Firebase configuration
cp .env.example .env

# Serve for development
npm run serve

# Build for production
npm run build
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and set up the following providers:
   - Google
   - GitHub
   - Twitter
   - Facebook
3. Get your Firebase configuration from Project Settings
4. Copy the configuration values to your `.env` file:
   ```
   VUE_APP_FIREBASE_API_KEY=your-api-key
   VUE_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VUE_APP_FIREBASE_PROJECT_ID=your-project-id
   VUE_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VUE_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VUE_APP_FIREBASE_APP_ID=your-app-id
   ```

### Social Authentication Setup

#### Google
1. Enable Google Sign-In in Firebase Console
2. No additional setup required

#### GitHub
1. Register a new OAuth application at GitHub
2. Add callback URL from Firebase
3. Copy Client ID and Secret to Firebase Console

#### Twitter
1. Create a Twitter Developer account
2. Create a new app
3. Configure callback URL from Firebase
4. Copy API Key and Secret to Firebase Console

#### Facebook
1. Create a Facebook Developer account
2. Create a new app
3. Add Firebase OAuth redirect URL
4. Copy App ID and Secret to Firebase Console

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Netlify and click "New site from Git"
3. Choose your repository
4. Add your environment variables from `.env` to Netlify's environment variables
5. Build settings will be automatically configured:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

The site will be automatically deployed and you'll get a unique URL. Netlify also provides:
- Automatic deployments on git push
- Custom domains
- HTTPS
- Continuous deployment

## Development Notes

- The application uses localStorage for data persistence
- In a production environment, you should:
  - Implement a proper backend API
  - Use secure authentication
  - Add input validation
  - Implement proper error handling
  - Add rate limiting
  - Add moderation features
  - Consider using a real database instead of localStorage

## Environment Variables

Required environment variables:
```
VUE_APP_FIREBASE_API_KEY
VUE_APP_FIREBASE_AUTH_DOMAIN
VUE_APP_FIREBASE_PROJECT_ID
VUE_APP_FIREBASE_STORAGE_BUCKET
VUE_APP_FIREBASE_MESSAGING_SENDER_ID
VUE_APP_FIREBASE_APP_ID
```

## License

MIT
