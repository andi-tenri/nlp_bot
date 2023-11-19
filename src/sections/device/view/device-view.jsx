import { useEffect, useReducer, useState } from 'react';

import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ConfirmationDialogProvider from 'src/components/dialog/confirm-dialog';
import { getDevices } from 'src/services/bot-service';
import DeviceModalCreate from '../device-modal-create';
import UserTableHead from '../device-table-head';
import DeviceTableRow from '../device-table-row';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function DevicePage() {
  const [devices, setDevices] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const devices = await getDevices();
    setDevices(devices);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = devices.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const dataFiltered = applyFilter({
    inputData: devices,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <ConfirmationDialogProvider>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
          <Typography variant="h4">Devices</Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={fetchDevices}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenCreateModal}
          >
            New Device
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={devices.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'id', label: 'id' },
                    { id: 'name', label: 'Name' },
                    { id: 'number', label: 'Number' },
                    { id: 'connectionStatus', label: 'Status' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DeviceTableRow
                        {...row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        refresh={fetchDevices}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, devices.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={devices.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <DeviceModalCreate
          openCreateModal={openCreateModal}
          setOpenCreateModal={setOpenCreateModal}
          refresh={fetchDevices}
        />
      </Container>
    </ConfirmationDialogProvider>
  );
}
