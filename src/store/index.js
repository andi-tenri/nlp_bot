import { configureStore } from '@reduxjs/toolkit'
import dialogReducer from './dialog'

export default configureStore({
    reducer: {
        dialog: dialogReducer
    },
})