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
import { createProduct, updateProduct } from 'src/services/product-service';

const ProductModalCreate = (props) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (props.data) {
      for (const key in props.data) {
        setValue(key, props.data[key]);
      }
      setImagePreview("/images/" + props.data.image);
    } else {
      reset();
      setImagePreview(null);
    }
  }, [props.data]);

  const onSubmit = async (data) => {
    if (props.data) {
      await updateProduct(props.data.id, data);
    } else {
      await createProduct(data);
    }
    handleClose();
    props.refresh();
  };

  const handleClose = () => {
    reset();
    props.setOpenCreateModal(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('image', { type: 'required', message: 'This field is required' });
      return;
    }
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setError('image', { type: 'pattern', message: 'Only image files are allowed' });
      return;
    }
    setImagePreview(URL.createObjectURL(file));
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
            name="stock"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="stock"
                label="Stock"
                type="number"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="price"
                label="Price"
                type="number"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="text"
                multiline
                rows={2}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />

          <TextField
            {...register('image', { required: props.data ? false : 'This field is required' })}
            onChange={handleImageChange}
            autoFocus
            margin="dense"
            id="image"
            label="Image"
            type="file"
            fullWidth
            helperText={errors.image ? errors.image.message : null}
            error={!!errors.image}
          />
          {/* image preview */}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
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
