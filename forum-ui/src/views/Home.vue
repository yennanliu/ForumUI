<template>
  <div class="home">
    <header class="hero">
      <h1>Welcome to Our Forum</h1>
      <p>Join the conversation and connect with others</p>
    </header>

    <section class="boards-section">
      <h2>Discussion Boards</h2>
      <div class="boards-grid">
        <router-link 
          v-for="board in boards" 
          :key="board.id"
          :to="{ name: 'Board', params: { topic: board.topic }}"
          class="board-card"
        >
          <i :class="getBoardIcon(board.topic)" class="mdi board-icon"></i>
          <h3>{{ board.name }}</h3>
        </router-link>
      </div>
    </section>

    <section class="recent-posts">
      <h2>Recent Posts</h2>
      <div class="posts-list">
        <div v-for="post in recentPosts" :key="post.id" class="post-preview">
          <h3>
            <router-link :to="{ name: 'PostDetail', params: { id: post.id }}">
              {{ post.title }}
            </router-link>
          </h3>
          <p class="post-meta">Posted by {{ post.author }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeView',
  setup() {
    const store = useStore()

    // Fetch posts when component is mounted
    store.dispatch('fetchPosts')

    const boards = computed(() => store.getters.allBoards)
    const recentPosts = computed(() => store.getters.allPosts.slice(0, 5))

    const getBoardIcon = (topic) => {
      const icons = {
        general: 'mdi-forum',
        tech: 'mdi-laptop',
        entertainment: 'mdi-movie',
        sports: 'mdi-basketball'
      }
      return icons[topic] || 'mdi-forum'
    }

    return {
      boards,
      recentPosts,
      getBoardIcon
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 16px;
}

.boards-section, .recent-posts {
  margin-bottom: 40px;
}

.boards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.board-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.board-card:hover {
  transform: translateY(-2px);
}

.board-icon {
  font-size: 2em;
  margin-bottom: 12px;
  color: #6366f1;
}

.post-preview {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.post-preview h3 {
  margin-bottom: 8px;
}

.post-preview a {
  color: #1f2937;
  text-decoration: none;
}

.post-preview a:hover {
  color: #6366f1;
}

.post-meta {
  color: #6b7280;
  font-size: 0.9em;
}
</style> 