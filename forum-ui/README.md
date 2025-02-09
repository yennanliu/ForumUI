# Forum UI

A modern forum application built with Vue.js that allows users to participate in discussions across different topic boards.

## Features

- User authentication (register/login)
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
- Material Design Icons
- Local Storage for data persistence

## Project Setup

```bash
# Install dependencies
npm install

# Serve for development
npm run serve

# Build for production
npm run build
```

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Netlify and click "New site from Git"
3. Choose your repository
4. Build settings will be automatically configured:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

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

## Environment Variables

No environment variables are required for basic functionality as the app uses localStorage.

## License

MIT
