import { ref, push, set, onValue, off, update, remove, get } from "firebase/database"
import { database } from "./firebase"
import type { CommunityPost, CommunityComment, PostType } from "./types"
import { store } from "./store/redux-store"
import { addDemoPost, toggleLikeDemoPost, addCommentDemoPost } from "./store/community-slice"

const POSTS_PATH = "community/posts"

const DEMO_POSTS: CommunityPost[] = [
    {
        id: "demo-1",
        authorId: "demo-user-1",
        authorName: "Suresh Kumar",
        type: "farming_tip",
        title: "Best time for paddy irrigation",
        content: "I've found that early morning irrigation (before 8 AM) significantly reduces water loss through evaporation and helps the roots absorb moisture better during hot days.",
        timestamp: Date.now() - 3600000 * 24,
        likes: ["demo-user-2", "demo-user-3"],
        comments: [],
        farmInfo: {
            cropType: "Paddy",
            soilType: "Clay",
            farmSize: "5",
            irrigationMethod: "Surface Irrigation",
            lastUpdated: Date.now()
        }
    },
    {
        id: "demo-2",
        authorId: "demo-user-2",
        authorName: "Priya Singh",
        type: "question",
        title: "How to deal with tomato blight?",
        content: "My tomato plants are showing dark spots on lower leaves. Is this early blight? Any organic solutions suggested by experts here?",
        timestamp: Date.now() - 3600000 * 12,
        likes: ["demo-user-1"],
        comments: [],
        farmInfo: {
            cropType: "Tomato",
            soilType: "Loamy",
            farmSize: "1.5",
            irrigationMethod: "Drip Irrigation",
            lastUpdated: Date.now()
        }
    }
]

// In-memory storage for demo mode is now handled by Redux
const getLocalPosts = () => {
    const reduxPosts = store.getState().community.demoPosts
    // Combine hardcoded DEMO_POSTS with Redux posts, filtering duplicates by ID
    const allPosts = [...reduxPosts]
    DEMO_POSTS.forEach(dp => {
        if (!allPosts.find(p => p.id === dp.id)) {
            allPosts.push(dp)
        }
    })
    return allPosts.sort((a, b) => b.timestamp - a.timestamp)
}

export const createPost = async (
    post: Omit<CommunityPost, "id" | "likes" | "comments" | "timestamp">
): Promise<string | null> => {
    if (!database) {
        // Demo Mode: Add to Redux storage
        const newId = `local-${Date.now()}`
        const newPost: CommunityPost = {
            ...post,
            id: newId,
            timestamp: Date.now(),
            likes: [],
            comments: [],
        }
        store.dispatch(addDemoPost(newPost))
        return newId
    }

    const postsRef = ref(database, POSTS_PATH)
    const newPostRef = push(postsRef)

    const newPost: CommunityPost = {
        ...post,
        id: newPostRef.key || "",
        timestamp: Date.now(),
        likes: [],
        comments: [],
    }

    await set(newPostRef, newPost)
    return newPostRef.key
}

export const subscribeToPosts = (callback: (posts: CommunityPost[]) => void) => {
    if (!database) {
        // Demo Mode: Subscribe to Redux store changes
        callback(getLocalPosts())
        const unsubscribe = store.subscribe(() => {
            callback(getLocalPosts())
        })
        return unsubscribe
    }

    const postsRef = ref(database, POSTS_PATH)

    const listener = onValue(postsRef, (snapshot) => {
        const data = snapshot.val()
        if (!data) {
            // If database exists but is empty, merge with demo posts for better UX
            callback(DEMO_POSTS)
            return
        }

        // Convert object to array and ensure each item has its ID
        const postsList: CommunityPost[] = Object.entries(data).map(([key, val]: [string, any]) => ({
            ...val,
            id: key
        }))
        // Sort by timestamp descending
        postsList.sort((a, b) => b.timestamp - a.timestamp)
        callback(postsList)
    })

    return () => off(postsRef, "value", listener)
}

export const likePost = async (postId: string, userId: string): Promise<void> => {
    if (!database) {
        // Demo Mode: Toggle like in Redux
        store.dispatch(toggleLikeDemoPost({ postId, userId }))
        return
    }

    const postRef = ref(database, `${POSTS_PATH}/${postId}/likes`)
    const snapshot = await get(postRef)
    let currentLikes: string[] = snapshot.val() || []

    if (currentLikes.includes(userId)) {
        currentLikes = currentLikes.filter(id => id !== userId)
    } else {
        currentLikes.push(userId)
    }

    await set(postRef, currentLikes)
}

export const addComment = async (
    postId: string,
    comment: Omit<CommunityComment, "id" | "timestamp">
): Promise<void> => {
    if (!database) {
        // Demo Mode: Add comment in Redux
        const newComment: CommunityComment = {
            ...comment,
            id: `local-comment-${Date.now()}`,
            timestamp: Date.now(),
        }
        store.dispatch(addCommentDemoPost({ postId, comment: newComment }))
        return
    }

    const commentsRef = ref(database, `${POSTS_PATH}/${postId}/comments`)
    const newCommentRef = push(commentsRef)

    const newComment: CommunityComment = {
        ...comment,
        id: newCommentRef.key || "",
        timestamp: Date.now(),
    }

    await set(newCommentRef, newComment)
}
