<template>
  <div class="board-page">
    <div class="board-header">
      <div class="board-info">
        <i :class="getBoardIcon(currentBoard?.topic)" class="mdi board-icon"></i>
        <div class="board-title">
          <h1>{{ currentBoard?.name || 'Loading...' }}</h1>
          <p class="board-description">{{ getBoardDescription(currentBoard?.topic) }}</p>
        </div>
      </div>
      <button v-if="isAuthenticated" @click="showNewPostForm = true" class="new-post-btn">
        <i class="mdi mdi-plus"></i> New Post
      </button>
    </div>

    <!-- New Post Form -->
    <div v-if="showNewPostForm" class="new-post-form">
      <h2>Create New Post in {{ currentBoard?.name }}</h2>
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
    <div class="board-content">
      <div class="posts-list">
        <div v-for="post in boardPosts" :key="post.id" class="post-card">
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
              <span class="timestamp">
                <i class="mdi mdi-clock-outline"></i>
                {{ formatDate(post.timestamp) }}
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
        <div v-if="boardPosts.length === 0" class="no-posts">
          No posts in this board yet. Be the first to start a discussion!
        </div>
      </div>

      <!-- Board Navigation -->
      <div class="board-nav">
        <h3>All Boards</h3>
        <nav>
          <router-link
            v-for="board in boards"
            :key="board.id"
            :to="{ name: 'Board', params: { topic: board.topic }}"
            class="board-link"
            :class="{ active: board.topic === currentBoard?.topic }"
          >
            <i :class="getBoardIcon(board.topic)" class="mdi"></i>
            {{ board.name }}
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'BoardView',
  setup() {
    const store = useStore()
    const route = useRoute()
    const showNewPostForm = ref(false)
    const newPost = ref({
      title: '',
      content: ''
    })

    // Get current board based on route parameter
    const currentBoard = computed(() => 
      store.getters.allBoards.find(board => board.topic === route.params.topic)
    )

    // Watch for route changes to update current board
    watch(() => route.params.topic, (newTopic) => {
      store.commit('SET_CURRENT_BOARD', 
        store.getters.allBoards.find(board => board.topic === newTopic)
      )
    }, { immediate: true })

    const boards = computed(() => store.getters.allBoards)
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)

    // Filter posts for current board (in a real app, this would be handled by the backend)
    const boardPosts = computed(() => 
      store.getters.allPosts.filter(post => post.board === currentBoard.value?.topic)
    )

    const getBoardIcon = (topic) => {
      const icons = {
        general: 'mdi-forum',
        tech: 'mdi-laptop',
        entertainment: 'mdi-movie',
        sports: 'mdi-basketball'
      }
      return icons[topic] || 'mdi-forum'
    }

    const getBoardDescription = (topic) => {
      const descriptions = {
        general: 'General discussion about anything and everything',
        tech: 'Discuss the latest in technology, programming, and digital trends',
        entertainment: 'Share your thoughts on movies, TV shows, music, and more',
        sports: 'Talk about your favorite sports, teams, and athletic events'
      }
      return descriptions[topic] || ''
    }

    const createNewPost = () => {
      if (!isAuthenticated.value) return

      store.dispatch('createPost', {
        ...newPost.value,
        author: currentUser.value.name,
        timestamp: new Date().toISOString(),
        board: currentBoard.value.topic
      })

      newPost.value = { title: '', content: '' }
      showNewPostForm.value = false
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
      return content.length > 200 ? content.substring(0, 200) + '...' : content
    }

    return {
      currentBoard,
      boards,
      isAuthenticated,
      showNewPostForm,
      newPost,
      boardPosts,
      getBoardIcon,
      getBoardDescription,
      createNewPost,
      formatDate,
      truncateContent
    }
  }
}
</script>

<style scoped>
.board-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.board-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.board-icon {
  font-size: 2.5em;
  color: #6366f1;
}

.board-title h1 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.board-description {
  color: #6b7280;
  margin: 0;
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

.board-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.new-post-form {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
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
  margin-bottom: 16px;
}

.post-header {
  margin-bottom: 12px;
}

.post-header h2 {
  margin: 0 0 8px 0;
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
  line-height: 1.5;
}

.read-more {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

.board-nav {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.board-nav h3 {
  color: #374151;
  margin: 0 0 16px 0;
}

.board-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #4b5563;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.board-link:hover {
  background-color: #f3f4f6;
}

.board-link.active {
  background-color: #f3f4f6;
  color: #6366f1;
  font-weight: 500;
}

.no-posts {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  color: #6b7280;
}
</style> 