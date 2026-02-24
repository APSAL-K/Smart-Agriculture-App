import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Language = 'en' | 'ta' | 'ml' | 'hi' | 'ar'

export interface ApiKeys {
    gemini: string
    openRouter: string
    cohere: string
}

interface SettingsState {
    language: Language
    apiKeys: ApiKeys
}

const STORAGE_KEY = 'smart_agri_settings'

const loadSettings = (): SettingsState => {
    if (typeof window === 'undefined') return {
        language: 'en',
        apiKeys: { gemini: '', openRouter: '', cohere: '' }
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
        language: 'en',
        apiKeys: { gemini: '', openRouter: '', cohere: '' }
    }
}

const initialState: SettingsState = loadSettings()

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        },
        updateApiKeys: (state, action: PayloadAction<Partial<ApiKeys>>) => {
            state.apiKeys = { ...state.apiKeys, ...action.payload }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        },
    },
})

export const { setLanguage, updateApiKeys } = settingsSlice.actions
export default settingsSlice.reducer
