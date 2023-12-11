import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useConfirmationDialog } from 'src/components/dialog/confirm-dialog';
import Iconify from 'src/components/iconify';
import { deleteProduct } from 'src/services/product-service';
import { formatRupiah } from 'src/utils/format-number';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  selected,
  id,
  name,
  description,
  image,
  price,
  stock,
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
    await deleteProduct(id);
    refresh();
    handleCloseMenu();
  };

  const handleDelete = () => {
    showConfirmation({
      title: 'Delete Product',
      text: `Are you sure you want to delete product "${id}"?`,
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
        <TableCell>{id}</TableCell>

        <TableCell>
          <div title={name} className="line-clamp">
            {name}
          </div>
        </TableCell>

        <TableCell>
          <img src={'/images/' + image} alt={name} width={100} />
        </TableCell>

        <TableCell>
          <div title={description} className="line-clamp">
            {description}
          </div>
        </TableCell>

        <TableCell>
          <div title={stock} className="line-clamp">
            {stock}
          </div>
        </TableCell>

        <TableCell>
          <div title={price} className="line-clamp">
            {formatRupiah(price)}
          </div>
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
        <MenuItem onClick={handleOpenEdit} sx={{ color: 'primary.main' }}>
          <Iconify icon="solar:pen-2-linear" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
