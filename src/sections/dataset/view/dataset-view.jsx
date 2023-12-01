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
import LoadingButton from '@mui/lab/LoadingButton';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ConfirmationDialogProvider from 'src/components/dialog/confirm-dialog';
import { getDataset, refreshModel } from 'src/services/dataset-service';
import DeviceModalCreate from '../dataset-modal-create';
import DatasetTableHead from '../dataset-table-head';
import DatasetTableRow from '../dataset-table-row';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, emptyRows, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function DatasetPage() {
  const [dataset, setDataset] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [currentDataset, setCurrentDataset] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    fetchDataset();
  }, []);

  const fetchDataset = async () => {
    const dataset = await getDataset();
    setDataset(dataset);
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
      const newSelecteds = dataset.map((n) => n.name);
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
    setCurrentDataset({});
    setOpenCreateModal(true);
  };

  const handleEdit = (id) => {
    setOpenCreateModal(true);

    const currentDataset = dataset.find((dataset) => dataset.id === id);

    setCurrentDataset(currentDataset);
  };

  const handleRefreshModel = async () => {
    try {
      setRefreshing(true);
      await refreshModel();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: dataset,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <ConfirmationDialogProvider>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
          <Typography variant="h4">Dataset</Typography>

          <Box sx={{ flexGrow: 1 }} />

          <LoadingButton
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={handleRefreshModel}
            loading={refreshing}
          >
            Run Model
          </LoadingButton>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenCreateModal}
          >
            New Dataset
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <DatasetTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={dataset.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'id', label: 'id' },
                    { id: 'intent', label: 'Intent' },
                    { id: 'utterance', label: 'Utterance' },
                    { id: 'answer', label: 'Answer' },
                    { id: 'updatedAt', label: 'Updated At' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DatasetTableRow
                        {...row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        refresh={fetchDataset}
                        handleEdit={handleEdit}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, dataset.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={dataset.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <DeviceModalCreate
          openCreateModal={openCreateModal}
          setOpenCreateModal={setOpenCreateModal}
          refresh={fetchDataset}
          data={currentDataset}
        />
      </Container>
    </ConfirmationDialogProvider>
  );
}
