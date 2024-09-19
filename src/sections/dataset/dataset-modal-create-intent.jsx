import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createIntent, updateIntent } from 'src/services/dataset-service';

const DatasetModalCreateIntent = (props) => {
  const { openCreateModal, setOpenCreateModal, refresh, data } = props;

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (data) {
      // Set form values if editing an existing intent
      setValue('intent', data.intent);
    } else {
      // Clear form if creating a new intent
      reset();
    }
  }, [data, openCreateModal, reset, setValue]);

  const onSubmit = async (formData) => {
    try {
      if (data) {
        // Update existing intent
        await updateIntent(formData.intent, data.utterance, data.answer, data.intent);
      } else {
        // Create new intent
        await createIntent(formData.intent, formData.utterance, formData.answer);
      }
      handleClose();
      refresh();
    } catch (error) {
      console.error('Error saving intent:', error);
      // Optionally show an error message to the user
    }
  };

  const handleClose = () => {
    reset(); // Ensure the form is reset when closing the modal
    setOpenCreateModal(false);
  };

  return (
    <Dialog
      open={openCreateModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{data ? 'Edit Intent' : 'Create New Intent'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Controller
            name="intent"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="intent"
                label="Intent"
                type="text"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          {!data && (
            <>
              <Controller
                name="utterance"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="utterance"
                    label="Question"
                    type="text"
                    fullWidth
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
              <Controller
                name="answer"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="answer"
                    label="Answer"
                    type="text"
                    fullWidth
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ color: 'red' }}>Close</Button>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

DatasetModalCreateIntent.propTypes = {
  openCreateModal: PropTypes.bool.isRequired,
  setOpenCreateModal: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default DatasetModalCreateIntent;
