import { useEffect } from 'react'

export const usePageLoaded = () => {
    useEffect(() => {
        document.body.classList.add("loaded")
    }, [])
}