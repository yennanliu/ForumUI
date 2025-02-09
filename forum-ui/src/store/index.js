import { createStore } from 'vuex'

// Load initial state from localStorage
const loadState = () => {
  try {
    const users = JSON.parse(localStorage.getItem('forum_users')) || []
    const posts = JSON.parse(localStorage.getItem('forum_posts')) || []
    const currentUser = JSON.parse(localStorage.getItem('forum_current_user'))
    return { users, posts, currentUser }
  } catch (e) {
    return { users: [], posts: [], currentUser: null }
  }
}

const initialState = loadState()

export default createStore({
  state: {
    user: initialState.currentUser,
    users: initialState.users,
    posts: initialState.posts || [],
    boards: [
      { id: 1, name: 'General Discussion', topic: 'general' },
      { id: 2, name: 'Technology', topic: 'tech' },
      { id: 3, name: 'Entertainment', topic: 'entertainment' },
      { id: 4, name: 'Sports', topic: 'sports' }
    ],
    currentBoard: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('forum_current_user', JSON.stringify(user))
    },
    ADD_USER(state, user) {
      state.users.push(user)
      localStorage.setItem('forum_users', JSON.stringify(state.users))
    },
    SET_POSTS(state, posts) {
      state.posts = posts
      localStorage.setItem('forum_posts', JSON.stringify(posts))
    },
    ADD_POST(state, post) {
      state.posts.unshift(post)
      localStorage.setItem('forum_posts', JSON.stringify(state.posts))
    },
    SET_CURRENT_BOARD(state, board) {
      state.currentBoard = board
    },
    ADD_REPLY(state, { postId, reply }) {
      const post = state.posts.find(p => p.id === postId)
      if (post) {
        if (!post.replies) post.replies = []
        post.replies.push(reply)
        localStorage.setItem('forum_posts', JSON.stringify(state.posts))
      }
    },
    UPDATE_USER_PROFILE(state, { userId, updates }) {
      // Update in users array
      const userIndex = state.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        const user = state.users[userIndex]
        state.users[userIndex] = { ...user, ...updates }
        localStorage.setItem('forum_users', JSON.stringify(state.users))

        // If this is the current user, update the current user state
        if (state.user && state.user.id === userId) {
          state.user = {
            ...state.user,
            name: updates.username || state.user.name,
            bio: updates.bio,
            location: updates.location,
            website: updates.website,
            avatar: updates.avatar
          }
          localStorage.setItem('forum_current_user', JSON.stringify(state.user))
        }
      }
    }
  },
  actions: {
    register({ commit, state }, { username, password }) {
      // Check if user already exists
      const userExists = state.users.some(u => u.username === username)
      if (userExists) {
        throw new Error('Username already exists')
      }

      const newUser = {
        id: Date.now(),
        username,
        password, // In a real app, this should be hashed
        joinDate: new Date().toISOString()
      }

      commit('ADD_USER', newUser)
      return true
    },
    login({ commit, state }, { username, password }) {
      // Find user
      const user = state.users.find(
        u => u.username === username && u.password === password
      )

      if (!user) {
        throw new Error('Invalid username or password')
      }

      // Create a sanitized user object without password
      const userWithoutPassword = {
        id: user.id,
        name: user.username,
        joinDate: user.joinDate
      }

      commit('SET_USER', userWithoutPassword)
      return userWithoutPassword
    },
    logout({ commit }) {
      commit('SET_USER', null)
    },
    fetchPosts({ commit, state }, boardTopic = null) {
      // Use posts from state (localStorage)
      const posts = state.posts.length > 0 ? state.posts : [
        { 
          id: 1, 
          title: 'Welcome to the Forum', 
          content: 'This is our first post!', 
          author: 'Admin', 
          replies: [],
          board: 'general',
          timestamp: new Date().toISOString()
        },
        { 
          id: 2, 
          title: 'How to use the forum', 
          content: 'Here are some tips...', 
          author: 'Moderator', 
          replies: [],
          board: 'general',
          timestamp: new Date().toISOString()
        }
      ]

      // Filter posts by board topic if provided
      const filteredPosts = boardTopic ? posts.filter(post => post.board === boardTopic) : posts
      commit('SET_POSTS', filteredPosts)
    },
    createPost({ commit }, post) {
      const newPost = {
        id: Date.now(),
        ...post,
        replies: [],
        timestamp: new Date().toISOString()
      }
      commit('ADD_POST', newPost)
    },
    addReply({ commit }, { postId, reply }) {
      const newReply = {
        id: Date.now(),
        ...reply,
        timestamp: new Date().toISOString()
      }
      commit('ADD_REPLY', { postId, reply: newReply })
    },
    updateProfile({ commit, state }, { userId, updates }) {
      // Validate username uniqueness if username is being updated
      if (updates.username) {
        const userExists = state.users.some(
          u => u.username === updates.username && u.id !== userId
        )
        if (userExists) {
          throw new Error('Username already exists')
        }
      }

      commit('UPDATE_USER_PROFILE', { userId, updates })
      return true
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    allPosts: state => state.posts,
    getPostById: state => id => state.posts.find(post => post.id === id),
    allBoards: state => state.boards
  }
}) 