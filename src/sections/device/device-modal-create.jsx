import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { createDevice } from 'src/services/bot-service';
import { useNavigate } from 'react-router-dom';

const DeviceModalCreate = (props) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      id: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await createDevice(data.id);
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
      <DialogTitle>Create New Device</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <Controller
          name="id"
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
              id="id"
              label="Device ID"
              type="text"
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

DeviceModalCreate.propTypes = {
  openCreateModal: PropTypes.bool,
  setOpenCreateModal: PropTypes.func,
  refresh: PropTypes.func,
};

export default DeviceModalCreate;
