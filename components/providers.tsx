"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store/redux-store"
import { AuthProvider } from "@/lib/auth-context"
import { DirectionProvider } from "./direction-provider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <DirectionProvider>
                    {children}
                </DirectionProvider>
            </AuthProvider>
        </Provider>
    )
}
