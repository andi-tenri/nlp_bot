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
import { createDataset, updateDataset } from 'src/services/dataset-service';

const ProductModalCreate = (props) => {
  const { control, handleSubmit, reset, setValue, getValues, setError, clearErrors } = useForm();

  useEffect(() => {
    if (props.data) {
      setValue('intent', props.data.intent);
      setValue('utterance', props.data.utterance);
      setValue('answer', props.data.answer);
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    if (!getValues('image')) {
      return setError('image', { type: 'required', message: 'This field is required' });
    }
    if (props.data) {
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

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    if (!image) {
      setError('image', { type: 'required', message: 'This field is required' });
      return;
    }
    if (!image.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError('image', { type: 'pattern', message: 'Only image files are allowed' });
      return;
    }
    clearErrors('image');
    console.log(image);
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
      <DialogTitle>{props.data ? 'Edit' : 'Create New'} Product</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                // starts with 'AD' with no space
                value: /^AD\S*$/,
                message: 'This field should start with AD and have no spaces',
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="image"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                onChange={handleImageChange}
                autoFocus
                margin="dense"
                id="image"
                label="Image"
                type="file"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          {/* image preview */}
          {getValues('image') && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

ProductModalCreate.propTypes = {
  openCreateModal: PropTypes.bool,
  setOpenCreateModal: PropTypes.func,
  refresh: PropTypes.func,
  data: PropTypes.object,
};

export default ProductModalCreate;
