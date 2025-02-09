import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    posts: [],
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
    },
    SET_POSTS(state, posts) {
      state.posts = posts
    },
    ADD_POST(state, post) {
      state.posts.unshift(post)
    },
    SET_CURRENT_BOARD(state, board) {
      state.currentBoard = board
    },
    ADD_REPLY(state, { postId, reply }) {
      const post = state.posts.find(p => p.id === postId)
      if (post) {
        if (!post.replies) post.replies = []
        post.replies.push(reply)
      }
    }
  },
  actions: {
    login({ commit }, user) {
      // In a real app, this would make an API call
      commit('SET_USER', user)
    },
    logout({ commit }) {
      commit('SET_USER', null)
    },
    fetchPosts({ commit }, boardTopic = null) {
      // Simulated API call
      const posts = [
        { 
          id: 1, 
          title: 'Welcome to the Forum', 
          content: 'This is our first post!', 
          author: 'Admin', 
          replies: [],
          board: 'general'
        },
        { 
          id: 2, 
          title: 'How to use the forum', 
          content: 'Here are some tips...', 
          author: 'Moderator', 
          replies: [],
          board: 'general'
        }
      ]
      // Filter posts by board topic if provided
      const filteredPosts = boardTopic ? posts.filter(post => post.board === boardTopic) : posts
      commit('SET_POSTS', filteredPosts)
    },
    createPost({ commit }, post) {
      // In a real app, this would make an API call
      const newPost = {
        id: Date.now(),
        ...post,
        replies: []
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