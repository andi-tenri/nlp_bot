import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useConfirmationDialog } from 'src/components/dialog/confirm-dialog';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { deleteDevice } from 'src/services/bot-service';

// ----------------------------------------------------------------------

export default function DeviceTableRow({
  selected,
  id,
  name,
  number,
  connectionStatus,
  handleClick,
  refresh,
}) {
  const [open, setOpen] = useState(null);

  const navigate = useNavigate();

  const { showConfirmation } = useConfirmationDialog();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const onDelete = async () => {
    await deleteDevice(id);
    refresh();
    handleCloseMenu();
  };

  const handleDelete = () => {
    showConfirmation({
      title: 'Delete Device',
      text: `Are you sure you want to delete device "${id}"?`,
      callback: onDelete,
    });
  };

  const handleQR = () => {
    navigate(`/device/${id}`);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell>{number}</TableCell>

        <TableCell>
          <Label color={(connectionStatus === 'Disconnected' && 'error') || 'success'}>
            {connectionStatus}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleQR}>
          <Iconify
            icon={connectionStatus == 'Disconnected' ? 'solar:qr-code-linear' : 'solar:eye-linear'}
            sx={{ mr: 2 }}
          />
          {connectionStatus == 'Disconnected' ? 'QR Code' : 'View'}
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
