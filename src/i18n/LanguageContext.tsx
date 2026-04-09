import { createContext, useContext, useState } from 'react'
import { translations, type Lang, type T } from './translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: T
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('app-lang') as Lang) ?? 'en'
  })

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('app-lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT() {
  return useContext(LanguageContext)
}
