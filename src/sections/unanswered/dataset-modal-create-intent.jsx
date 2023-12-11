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
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createDataset, createIntent, updateDataset, updateIntent } from 'src/services/dataset-service';

const DatasetModalCreateIntent = (props) => {
  const { handleAddIntent } = props;

  const [oldIntent, setOldIntent] = useState('');

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (props.data) {
      setValue('intent', props.data.intent);
      setOldIntent(props.data.intent);
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    if (props.data) {
      await updateIntent(data.intent, oldIntent);
    } else {
      await createIntent(data.intent);
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
      <DialogTitle>{props.data ? 'Edit' : 'Create New'} Intent</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Controller
            name="intent"
            control={control}
            rules={{
              required: 'This field is required',
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
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

DatasetModalCreateIntent.propTypes = {
  openCreateModal: PropTypes.bool,
  setOpenCreateModal: PropTypes.func,
  refresh: PropTypes.func,
  data: PropTypes.object,
  handleAddIntent: PropTypes.func,
};

export default DatasetModalCreateIntent;
