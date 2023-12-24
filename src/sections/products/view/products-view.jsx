import { useEffect, useReducer, useState } from 'react';

import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';

// import { products } from 'src/_mock/products';

import Iconify from 'src/components/iconify';
import { getProducts } from 'src/services/product-service';
import ProductModalCreate from '../product-modal-create';
import ConfirmationDialogProvider, {
  useConfirmationDialog,
} from 'src/components/dialog/confirm-dialog';
import { applyFilter, emptyRows, getComparator } from 'src/sections/products/utils';
import ProductTableHead from '../product-table-head';
import ProductTableRow from '../product-table-row';
import Scrollbar from 'src/components/scrollbar';
import TableEmptyRows from '../product-empty-rows';
import { debounce } from 'src/sections/dataset/utils';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const products = await getProducts();
    setAllProducts(products);
    setProducts(products);
  };

  const handleNewProduct = () => {
    setCurrentProduct(null);
    setOpenCreateModal(true);
  };

  const handleProductEdit = (product) => {
    setCurrentProduct(product);
    setOpenCreateModal(true);
  };

  const handleSearch = (text) => {
    debounce(() => {
      handleFilter(text);
    }, 500)();
  };

  const handleFilter = (text) => {
    if (!text) {
      setProducts(allProducts);
      return;
    }

    const filteredProducts = JSON.parse(JSON.stringify(allProducts)).filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase()) ||
        item.stock.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.price.toString().toLowerCase().includes(text.toLowerCase())
    );

    setProducts(filteredProducts);
  };
  return (
    <ConfirmationDialogProvider>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} gap={2}>
          <Typography variant="h4">Products</Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewProduct}
          >
            New Product
          </Button>
        </Stack>

        <TextField
          sx={{
            marginBottom: 2,
          }}
          id="outlined-select-currency"
          fullWidth
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          placeholder="Search products..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <ProductTable products={products} fetchProducts={fetchProducts} />

        <ProductModalCreate
          openCreateModal={openCreateModal}
          setOpenCreateModal={setOpenCreateModal}
          refresh={fetchProducts}
          data={currentProduct}
        />
      </Container>
    </ConfirmationDialogProvider>
  );
}

function ProductTable(props) {
  const { products, fetchProducts, id } = props;

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('id');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [currentDataset, setCurrentProduct] = useState({});

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { showConfirmation } = useConfirmationDialog();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.name);
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

  const handleEdit = (id) => {
    setOpenCreateModal(true);

    const currentDataset = products.find((products) => products.id === id);

    setCurrentProduct(currentDataset);
  };

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenCreateModal = () => {
    setCurrentProduct({
      id,
    });
    setOpenCreateModal(true);
  };

  const onDelete = async () => {
    if (!products.length) {
      return await fetchProducts();
    }

    try {
      await deleteIntent(id);
      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIntent = () => {
    showConfirmation({
      title: 'Delete Product',
      text: `Are you sure you want to delete product "${id}"?`,
      callback: onDelete,
    });
  };

  return (
    <ConfirmationDialogProvider>
      <Card sx={{ p: 3, mb: 3 }}>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table>
                <ProductTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'id', label: 'id' },
                    { id: 'name', label: 'Name' },
                    { id: 'image', label: 'Image' },
                    { id: 'description', label: 'Description' },
                    { id: 'stock', label: 'Stock' },
                    { id: 'price', label: 'Price' },
                    { id: '', label: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ProductTableRow
                        {...row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        refresh={fetchProducts}
                        handleEdit={handleEdit}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, products.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Card>

      <ProductModalCreate
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        refresh={fetchProducts}
        data={currentDataset}
      />
    </ConfirmationDialogProvider>
  );
}
