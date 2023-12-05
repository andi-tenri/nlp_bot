import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

import ProductCard from '../product-card';
import Iconify from 'src/components/iconify';
import { getProducts } from 'src/services/product-service';
import ProductModalCreate from '../product-modal-create';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [products, setProducts] = useState([]);

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
    setProducts(products);
  };

  const handleNewProduct = () => {
    setOpenCreateModal(true);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          {/* <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort /> */}
          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewProduct}
          >
            New Product
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <ProductModalCreate
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        refresh={fetchProducts}
      />

      {/* <ProductCartWidget /> */}
    </Container>
  );
}
