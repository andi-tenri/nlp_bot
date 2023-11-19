import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        confirmDeleteDialog: {
            open: false,
            title: '',
            onConfirm: () => { },
            onCancel: () => { },
            confirmText: '',
            cancelText: ''
        }
    },
    reducers: {
        openConfirmDeleteDialog: (state, action) => {
            state.confirmDeleteDialog.open = true
            state.confirmDeleteDialog = {
                ...state.confirmDeleteDialog,
                ...action.payload
            }
        },
        closeConfirmDeleteDialog: (state) => {
            state.confirmDeleteDialog.open = false
            state.confirmDeleteDialog.onCancel()
        }
    }
})

export const { openConfirmDeleteDialog, closeConfirmDeleteDialog } = dialogSlice.actions

export default dialogSlice.reducer