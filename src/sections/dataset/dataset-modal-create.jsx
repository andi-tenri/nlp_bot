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
import { createDataset, updateDataset } from 'src/services/dataset-service';

const DatasetModalCreate = (props) => {
  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (props.data) {
      setValue('intent', props.data.intent);
      setValue('utterance', props.data.utterance);
      setValue('answer', props.data.answer);
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    if (props.data.id) {
      await updateDataset(props.data.id, data);
    } else {
      await createDataset(data);
    }
    handleClose();
    props.refresh();
  };

  const handleClose = () => {
    reset();
    props.setOpenCreateModal(false);
  };

  return (
    <Dialog
      open={props.openCreateModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{props.data ? "Edit" : "Create New"} Dataset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Controller
            name="intent"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /^[^\s]+$/,
                message: 'This field should not contain spaces',
              },
            }}
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
          {/* utterance, answer */}
          <Controller
            name="utterance"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
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
            rules={{
              required: 'This field is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="answer"
                label="Answer"
                type="text"
                fullWidth
                multiline
                rows={7}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

DatasetModalCreate.propTypes = {
  openCreateModal: PropTypes.bool,
  setOpenCreateModal: PropTypes.func,
  refresh: PropTypes.func,
  data: PropTypes.object,
};

export default DatasetModalCreate;
