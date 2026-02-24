import { useSelector } from 'react-redux'
import { RootState } from './store/redux-store'
import { translations, TranslationKey } from './translations'

export function useTranslation() {
    const language = useSelector((state: RootState) => state.settings.language)

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key] || key
    }

    return { t, language }
}
