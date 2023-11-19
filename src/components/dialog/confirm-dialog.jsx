import { useTheme } from '@emotion/react';
import React, { createContext, useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ConfirmationDialogContext = createContext();

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);

  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider');
  }

  return context;
};

export const ConfirmationDialogProvider = ({ children }) => {
  const theme = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  const [{ confirmTitle, confirmText, confirmCallback }, setConfirm] = useState({});

  const showConfirmation = ({ title, text, callback }) => {
    setShowDialog(true);
    setConfirm({ confirmTitle: title, confirmText: text, confirmCallback: callback });
  };

  const confirmAction = async () => {
    await confirmCallback();
    setShowDialog(false);
  };

  const cancelAction = () => {
    setShowDialog(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ showConfirmation }}>
      {children}
      {showDialog && (
        <Dialog
          open={showDialog}
          onClose={cancelAction}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{confirmTitle}?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{confirmText}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ color: theme.palette.text.secondary }} onClick={cancelAction}>
              Cancel
            </Button>
            <Button color='error' onClick={confirmAction}>Yes</Button>
          </DialogActions>
        </Dialog>
      )}
    </ConfirmationDialogContext.Provider>
  );
};

export default ConfirmationDialogProvider;
