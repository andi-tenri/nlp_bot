import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useConfirmationDialog } from 'src/components/dialog/confirm-dialog';
import Iconify from 'src/components/iconify';
import { deleteDataset, deleteUnanswered } from 'src/services/dataset-service';

import moment from 'moment';

// ----------------------------------------------------------------------

export default function DatasetTableRow({
  selected,
  id,
  intent,
  utterance,
  answer,
  updatedAt,
  handleClick,
  handleEdit,
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
    await deleteUnanswered(id);
    refresh();
    handleCloseMenu();
  };

  const handleDelete = () => {
    showConfirmation({
      title: 'Delete Unanswered',
      text: `Are you sure you want to delete unanswered "${id}"?`,
      callback: onDelete,
    });
  };

  const handleOpenEdit = () => {
    handleEdit(id);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell>{id}</TableCell> */}

        {/* <TableCell>{intent}</TableCell> */}

        <TableCell>
          <div title={utterance} className="line-clamp">
            {utterance}
          </div>
        </TableCell>

        {/* <TableCell>
          <div title={answer} className='line-clamp'>{answer}</div>
        </TableCell> */}

        {/* <TableCell>{updatedAt ? moment(updatedAt).format('DD/MM/YYYY HH:mm:ss') : ''}</TableCell> */}

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
        <MenuItem onClick={handleOpenEdit} sx={{ color: 'primary.main' }}>
          <Iconify icon="solar:diskette-line-outline" sx={{ mr: 2 }} />
          Save to Dataset
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
