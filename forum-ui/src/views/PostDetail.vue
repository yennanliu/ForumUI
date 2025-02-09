<template>
  <div class="post-detail-page">
    <div v-if="post" class="post-content">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author">
            <i class="mdi mdi-account"></i> {{ post.author }}
          </span>
          <span class="timestamp">
            <i class="mdi mdi-clock-outline"></i>
            {{ formatDate(post.timestamp) }}
          </span>
        </div>
      </div>

      <div class="post-body">
        {{ post.content }}
      </div>

      <!-- Replies Section -->
      <div class="replies-section">
        <h2>Replies</h2>
        
        <!-- New Reply Form -->
        <div v-if="isAuthenticated" class="reply-form">
          <textarea 
            v-model="newReply" 
            placeholder="Write your reply..."
            class="reply-input"
            rows="3"
          ></textarea>
          <button @click="submitReply" class="reply-btn">
            <i class="mdi mdi-send"></i> Reply
          </button>
        </div>
        <div v-else class="login-prompt">
          <p>Please log in to reply to this post.</p>
        </div>

        <!-- Replies List -->
        <div class="replies-list">
          <div v-for="reply in post.replies" :key="reply.id" class="reply-card">
            <div class="reply-header">
              <span class="reply-author">
                <i class="mdi mdi-account"></i> {{ reply.author }}
              </span>
              <span class="reply-timestamp">
                {{ formatDate(reply.timestamp) }}
              </span>
            </div>
            <div class="reply-content">
              {{ reply.content }}
            </div>
          </div>
          <div v-if="!post.replies || post.replies.length === 0" class="no-replies">
            No replies yet. Be the first to reply!
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      Loading post...
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'PostDetailView',
  setup() {
    const store = useStore()
    const route = useRoute()
    const newReply = ref('')

    const post = computed(() => 
      store.getters.getPostById(parseInt(route.params.id))
    )
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)

    onMounted(() => {
      // Fetch post data if needed
      store.dispatch('fetchPosts')
    })

    const submitReply = () => {
      if (!isAuthenticated.value || !newReply.value.trim()) return

      store.dispatch('addReply', {
        postId: parseInt(route.params.id),
        reply: {
          content: newReply.value,
          author: currentUser.value.name,
          timestamp: new Date().toISOString()
        }
      })

      newReply.value = ''
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      post,
      isAuthenticated,
      newReply,
      submitReply,
      formatDate
    }
  }
}
</script>

<style scoped>
.post-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.post-header {
  margin-bottom: 24px;
}

.post-header h1 {
  margin-bottom: 12px;
  color: #1f2937;
}

.post-meta {
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 0.9em;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-body {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 32px;
}

.replies-section {
  margin-top: 32px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.replies-section h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.reply-form {
  margin-bottom: 24px;
}

.reply-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  resize: vertical;
}

.reply-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reply-btn:hover {
  background-color: #4f46e5;
}

.login-prompt {
  text-align: center;
  padding: 16px;
  background-color: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 24px;
}

.reply-card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 16px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-author {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: #374151;
}

.reply-timestamp {
  color: #6b7280;
  font-size: 0.9em;
}

.reply-content {
  color: #4b5563;
  line-height: 1.5;
}

.no-replies {
  text-align: center;
  color: #6b7280;
  padding: 24px;
  background-color: #f3f4f6;
  border-radius: 6px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style> 