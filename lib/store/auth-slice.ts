import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    uid: string
    email: string
    displayName?: string
}

interface AuthState {
    user: User | null
    loading: boolean
}

const initialState: AuthState = {
    user: null,
    loading: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
            state.loading = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        clearUser: (state) => {
            state.user = null
            state.loading = false
        },
    },
})

export const { setUser, setLoading, clearUser } = authSlice.actions
export default authSlice.reducer
