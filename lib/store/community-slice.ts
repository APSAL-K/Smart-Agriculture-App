import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CommunityPost } from '../types'

interface CommunityState {
    demoPosts: CommunityPost[]
}

const STORAGE_KEY = 'smart_agri_community_demo'

const loadDemoPosts = (): CommunityPost[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
}

const initialState: CommunityState = {
    demoPosts: loadDemoPosts()
}

const communitySlice = createSlice({
    name: 'community',
    initialState,
    reducers: {
        addDemoPost: (state, action: PayloadAction<CommunityPost>) => {
            state.demoPosts.push(action.payload)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.demoPosts))
        },
        updateDemoPosts: (state, action: PayloadAction<CommunityPost[]>) => {
            state.demoPosts = action.payload
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.demoPosts))
        },
        toggleLikeDemoPost: (state, action: PayloadAction<{ postId: string, userId: string }>) => {
            const post = state.demoPosts.find(p => p.id === action.payload.postId)
            if (post) {
                if (post.likes.includes(action.payload.userId)) {
                    post.likes = post.likes.filter(id => id !== action.payload.userId)
                } else {
                    post.likes.push(action.payload.userId)
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.demoPosts))
            }
        },
        addCommentDemoPost: (state, action: PayloadAction<{ postId: string, comment: any }>) => {
            const post = state.demoPosts.find(p => p.id === action.payload.postId)
            if (post) {
                if (!post.comments) post.comments = []
                post.comments.push(action.payload.comment)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.demoPosts))
            }
        }
    },
})

export const { addDemoPost, updateDemoPosts, toggleLikeDemoPost, addCommentDemoPost } = communitySlice.actions
export default communitySlice.reducer
