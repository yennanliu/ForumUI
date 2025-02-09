<template>
  <div class="profile-page">
    <div v-if="isAuthenticated" class="profile-content">
      <div class="profile-header">
        <div class="avatar">
          <img v-if="currentUser.avatar" :src="currentUser.avatar" :alt="currentUser.name" class="avatar-img">
          <i v-else class="mdi mdi-account-circle"></i>
        </div>
        <div class="profile-title">
          <h1>{{ currentUser.name }}'s Profile</h1>
          <button @click="toggleEditMode" class="edit-btn">
            <i class="mdi" :class="isEditing ? 'mdi-close' : 'mdi-pencil'"></i>
            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
      </div>

      <div class="profile-sections">
        <!-- User Info Section -->
        <section class="profile-section">
          <h2>User Information</h2>
          <div v-if="isEditing" class="edit-form">
            <form @submit.prevent="saveProfile">
              <div class="form-group">
                <label for="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  v-model="editForm.username" 
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea 
                  id="bio" 
                  v-model="editForm.bio" 
                  class="form-input"
                  rows="3"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div class="form-group">
                <label for="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  v-model="editForm.location" 
                  class="form-input"
                  placeholder="City, Country"
                >
              </div>
              <div class="form-group">
                <label for="website">Website</label>
                <input 
                  type="url" 
                  id="website" 
                  v-model="editForm.website" 
                  class="form-input"
                  placeholder="https://example.com"
                >
              </div>
              <div class="form-group">
                <label for="avatar">Avatar URL</label>
                <input 
                  type="url" 
                  id="avatar" 
                  v-model="editForm.avatar" 
                  class="form-input"
                  placeholder="https://example.com/avatar.jpg"
                >
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">
                  <i class="mdi mdi-content-save"></i> Save Changes
                </button>
                <button type="button" @click="toggleEditMode" class="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div v-else class="info-grid">
            <div class="info-item">
              <label>Username</label>
              <p>{{ currentUser.name }}</p>
            </div>
            <div class="info-item">
              <label>Member Since</label>
              <p>{{ formatDate(currentUser.joinDate) }}</p>
            </div>
            <div class="info-item">
              <label>Location</label>
              <p>{{ currentUser.location || 'Not specified' }}</p>
            </div>
            <div class="info-item">
              <label>Website</label>
              <p>
                <a v-if="currentUser.website" :href="currentUser.website" target="_blank" rel="noopener noreferrer">
                  {{ currentUser.website }}
                </a>
                <span v-else>Not specified</span>
              </p>
            </div>
            <div class="info-item full-width">
              <label>Bio</label>
              <p>{{ currentUser.bio || 'No bio provided' }}</p>
            </div>
            <div class="info-item">
              <label>Posts</label>
              <p>{{ userPosts.length }}</p>
            </div>
            <div class="info-item">
              <label>Total Replies</label>
              <p>{{ totalReplies }}</p>
            </div>
          </div>
        </section>

        <!-- User Posts Section -->
        <section class="profile-section">
          <h2>My Posts</h2>
          <div class="posts-list">
            <div v-for="post in userPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <h3>
                  <router-link :to="{ name: 'PostDetail', params: { id: post.id }}">
                    {{ post.title }}
                  </router-link>
                </h3>
                <span class="post-date">{{ formatDate(post.timestamp) }}</span>
              </div>
              <p class="post-preview">{{ truncateContent(post.content) }}</p>
              <div class="post-stats">
                <span>
                  <i class="mdi mdi-comment-multiple-outline"></i>
                  {{ post.replies ? post.replies.length : 0 }} replies
                </span>
              </div>
            </div>
            <div v-if="userPosts.length === 0" class="no-posts">
              You haven't created any posts yet.
            </div>
          </div>
        </section>
      </div>
    </div>
    <div v-else class="login-required">
      <i class="mdi mdi-account-lock"></i>
      <h2>Login Required</h2>
      <p>Please log in to view your profile.</p>
      <button @click="$emit('show-login')" class="login-btn">
        <i class="mdi mdi-login"></i> Login
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserProfileView',
  setup() {
    const store = useStore()
    const isEditing = ref(false)
    const editForm = ref({
      username: '',
      bio: '',
      location: '',
      website: '',
      avatar: ''
    })

    const currentUser = computed(() => store.getters.currentUser)
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const userPosts = computed(() => 
      store.getters.allPosts.filter(post => 
        post.author === currentUser.value?.name
      )
    )

    const totalReplies = computed(() => {
      return store.getters.allPosts.reduce((total, post) => {
        const userReplies = post.replies?.filter(reply => 
          reply.author === currentUser.value?.name
        ) || []
        return total + userReplies.length
      }, 0)
    })

    const toggleEditMode = () => {
      if (!isEditing.value) {
        // Initialize form with current values
        editForm.value = {
          username: currentUser.value.name,
          bio: currentUser.value.bio || '',
          location: currentUser.value.location || '',
          website: currentUser.value.website || '',
          avatar: currentUser.value.avatar || ''
        }
      }
      isEditing.value = !isEditing.value
    }

    const saveProfile = async () => {
      try {
        await store.dispatch('updateProfile', {
          userId: currentUser.value.id,
          updates: editForm.value
        })
        isEditing.value = false
      } catch (error) {
        alert(error.message)
      }
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const truncateContent = (content) => {
      return content.length > 150 ? content.substring(0, 150) + '...' : content
    }

    return {
      currentUser,
      isAuthenticated,
      userPosts,
      totalReplies,
      isEditing,
      editForm,
      toggleEditMode,
      saveProfile,
      formatDate,
      truncateContent
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.avatar {
  font-size: 4em;
  color: #6366f1;
}

.profile-header h1 {
  color: #1f2937;
  margin: 0;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.profile-section h2 {
  color: #374151;
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.info-item {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 8px;
}

.info-item label {
  color: #6b7280;
  font-size: 0.9em;
  display: block;
  margin-bottom: 4px;
}

.info-item p {
  color: #1f2937;
  font-weight: 500;
  margin: 0;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-header h3 {
  margin: 0;
}

.post-header a {
  color: #1f2937;
  text-decoration: none;
}

.post-header a:hover {
  color: #6366f1;
}

.post-date {
  color: #6b7280;
  font-size: 0.9em;
}

.post-preview {
  color: #4b5563;
  margin-bottom: 12px;
}

.post-stats {
  color: #6b7280;
  font-size: 0.9em;
  display: flex;
  gap: 16px;
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.no-posts {
  text-align: center;
  padding: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
}

.login-required {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-required i {
  font-size: 3em;
  color: #6b7280;
  margin-bottom: 16px;
}

.login-required h2 {
  color: #374151;
  margin-bottom: 8px;
}

.login-required p {
  color: #6b7280;
  margin-bottom: 24px;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #4f46e5;
}

.profile-title {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn:hover {
  background-color: #e5e7eb;
}

.avatar-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-form {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1em;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
}

.save-btn {
  background-color: #6366f1;
  color: white;
}

.save-btn:hover {
  background-color: #4f46e5;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.full-width {
  grid-column: 1 / -1;
}

.info-item a {
  color: #6366f1;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}
</style> 