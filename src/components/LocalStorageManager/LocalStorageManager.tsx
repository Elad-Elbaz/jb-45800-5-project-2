import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../services/redux/hooks'
import { loadCoinFromStorage } from '../../services/redux/buttonSwitchSlice'
import { setAiApiKey } from '../../services/redux/aiSettingsSlice'



export default function LocalStorageManager() {
    const dispatch = useAppDispatch()
    const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
    const aiApiKey = useAppSelector(state => state.aiSettingsSlice.apiKey)

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('selectedCoins')
            if (savedData) {
                const parsed = JSON.parse(savedData)
                dispatch(loadCoinFromStorage(parsed))
            }

            const savedAiKey = localStorage.getItem('aiApiKey')
            if (savedAiKey) {
                dispatch(setAiApiKey(savedAiKey))
            }

        } catch (e) {
            alert(e)
        }
    }, [dispatch])

    useEffect(() => {
        if(selectedCoins.length > 0){
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins))
        }else{
            localStorage.removeItem('selectedCoins')
        }
    }, [selectedCoins])

    useEffect(() => {
        if (aiApiKey) {
            localStorage.setItem('aiApiKey', aiApiKey)
        } else {
            localStorage.removeItem('aiApiKey')
        }
    }, [aiApiKey])

    return null

}