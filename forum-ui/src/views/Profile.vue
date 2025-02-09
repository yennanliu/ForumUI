<template>
  <div class="profile-page">
    <div v-if="isAuthenticated" class="profile-content">
      <div class="profile-header">
        <div class="avatar">
          <i class="mdi mdi-account-circle"></i>
        </div>
        <h1>{{ currentUser.name }}'s Profile</h1>
      </div>

      <div class="profile-sections">
        <!-- User Info Section -->
        <section class="profile-section">
          <h2>User Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Username</label>
              <p>{{ currentUser.name }}</p>
            </div>
            <div class="info-item">
              <label>Member Since</label>
              <p>{{ formatDate(currentUser.joinDate) }}</p>
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
      <button class="login-btn">
        <i class="mdi mdi-login"></i> Login
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserProfileView',
  setup() {
    const store = useStore()

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
</style> 