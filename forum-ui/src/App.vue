<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">
          <i class="mdi mdi-forum"></i>
          Forum UI
        </router-link>

        <div class="nav-links">
          <router-link to="/posts" class="nav-link">
            <i class="mdi mdi-post"></i> Posts
          </router-link>
          <router-link :to="{ name: 'Board', params: { topic: 'general' }}" class="nav-link">
            <i class="mdi mdi-format-list-bulleted"></i> Boards
          </router-link>
        </div>

        <div class="nav-auth">
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="profile-link">
              <i class="mdi mdi-account-circle"></i>
              {{ currentUser.name }}
            </router-link>
            <button @click="logout" class="auth-btn logout-btn">
              <i class="mdi mdi-logout"></i>
              Logout
            </button>
          </template>
          <template v-else>
            <button @click="showLoginModal = true" class="auth-btn login-btn">
              <i class="mdi mdi-login"></i>
              Login
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal-overlay" @click="showLoginModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isRegistering ? 'Register' : 'Login' }}</h2>
          <button @click="showLoginModal = false" class="close-btn">
            <i class="mdi mdi-close"></i>
          </button>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="loginForm.username" 
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              required
              class="form-input"
            >
          </div>
          <button type="submit" class="submit-btn">
            <i class="mdi" :class="isRegistering ? 'mdi-account-plus' : 'mdi-login'"></i>
            {{ isRegistering ? 'Register' : 'Login' }}
          </button>
        </form>
        <div class="modal-footer">
          <button @click="toggleMode" class="toggle-btn">
            {{ isRegistering ? 'Already have an account? Login' : 'Need an account? Register' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ForumApp',
  setup() {
    const store = useStore()
    const showLoginModal = ref(false)
    const isRegistering = ref(false)
    const error = ref('')
    const loginForm = ref({
      username: '',
      password: ''
    })

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)

    const handleSubmit = async () => {
      error.value = ''
      try {
        if (isRegistering.value) {
          await store.dispatch('register', loginForm.value)
          // After successful registration, log them in
          await store.dispatch('login', loginForm.value)
        } else {
          await store.dispatch('login', loginForm.value)
        }
        loginForm.value = { username: '', password: '' }
        showLoginModal.value = false
      } catch (err) {
        error.value = err.message
      }
    }

    const toggleMode = () => {
      isRegistering.value = !isRegistering.value
      error.value = ''
    }

    const logout = () => {
      store.dispatch('logout')
    }

    return {
      showLoginModal,
      loginForm,
      isAuthenticated,
      currentUser,
      handleSubmit,
      logout,
      isRegistering,
      toggleMode,
      error
    }
  }
}
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --text-muted: #6b7280;
  --bg-light: #f3f4f6;
  --border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-light);
  color: var(--text-primary);
  line-height: 1.5;
}

/* Navigation Styles */
.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: var(--bg-light);
  color: var(--primary-color);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
}

.profile-link:hover {
  background-color: var(--bg-light);
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.login-btn {
  background-color: var(--primary-color);
  color: white;
}

.login-btn:hover {
  background-color: var(--primary-dark);
}

.logout-btn {
  background-color: var(--bg-light);
  color: var(--text-secondary);
}

.logout-btn:hover {
  background-color: var(--border-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  color: var(--text-muted);
  cursor: pointer;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1em;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover {
  background-color: var(--primary-dark);
}

/* Main Content */
.main-content {
  min-height: calc(100vh - 64px);
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.modal-footer {
  margin-top: 16px;
  text-align: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9em;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>
