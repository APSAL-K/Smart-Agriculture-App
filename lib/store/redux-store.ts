import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import settingsReducer from './settings-slice'
import communityReducer from './community-slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        community: communityReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
