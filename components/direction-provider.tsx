"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"

export function DirectionProvider({ children }: { children: React.ReactNode }) {
    const language = useSelector((state: RootState) => state.settings.language)
    const isRtl = language === 'ar'

    useEffect(() => {
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
        document.documentElement.lang = language
    }, [language, isRtl])

    return <>{children}</>
}
