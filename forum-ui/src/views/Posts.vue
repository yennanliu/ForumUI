<template>
  <div class="posts-page">
    <div class="posts-header">
      <h1>Forum Posts</h1>
      <button v-if="isAuthenticated" @click="showNewPostForm = true" class="new-post-btn">
        <i class="mdi mdi-plus"></i> New Post
      </button>
    </div>

    <!-- New Post Form -->
    <div v-if="showNewPostForm" class="new-post-form">
      <h2>Create New Post</h2>
      <form @submit.prevent="createNewPost">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="newPost.title" 
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea 
            id="content" 
            v-model="newPost.content" 
            required
            class="form-input"
            rows="4"
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Post</button>
          <button type="button" @click="showNewPostForm = false" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>

    <!-- Posts List -->
    <div class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <h2>
            <router-link :to="{ name: 'PostDetail', params: { id: post.id }}">
              {{ post.title }}
            </router-link>
          </h2>
          <div class="post-meta">
            <span class="author">
              <i class="mdi mdi-account"></i> {{ post.author }}
            </span>
            <span class="replies">
              <i class="mdi mdi-comment-multiple-outline"></i>
              {{ post.replies ? post.replies.length : 0 }} replies
            </span>
          </div>
        </div>
        <p class="post-preview">{{ truncateContent(post.content) }}</p>
        <router-link 
          :to="{ name: 'PostDetail', params: { id: post.id }}"
          class="read-more"
        >
          Read more
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ForumPosts',
  setup() {
    const store = useStore()
    const showNewPostForm = ref(false)
    const newPost = ref({
      title: '',
      content: ''
    })

    // Fetch posts when component is mounted
    store.dispatch('fetchPosts')

    const posts = computed(() => store.getters.allPosts)
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)

    const createNewPost = () => {
      if (!isAuthenticated.value) return

      store.dispatch('createPost', {
        ...newPost.value,
        author: currentUser.value.name,
        timestamp: new Date().toISOString()
      })

      newPost.value = { title: '', content: '' }
      showNewPostForm.value = false
    }

    const truncateContent = (content) => {
      return content.length > 200 ? content.substring(0, 200) + '...' : content
    }

    return {
      posts,
      isAuthenticated,
      showNewPostForm,
      newPost,
      createNewPost,
      truncateContent
    }
  }
}
</script>

<style scoped>
.posts-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.new-post-btn {
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

.new-post-btn:hover {
  background-color: #4f46e5;
}

.new-post-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.submit-btn, .cancel-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #6366f1;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #e5e7eb;
  border: none;
  color: #374151;
}

.post-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.post-header {
  margin-bottom: 12px;
}

.post-header h2 {
  margin-bottom: 8px;
}

.post-header a {
  color: #1f2937;
  text-decoration: none;
}

.post-header a:hover {
  color: #6366f1;
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

.post-preview {
  color: #4b5563;
  margin-bottom: 12px;
}

.read-more {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}
</style> 