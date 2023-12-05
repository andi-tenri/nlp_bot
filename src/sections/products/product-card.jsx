import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderImg}
        <Box sx={{ position: 'absolute', top: 14, right: 14, zIndex: 9 }}>
          <Button variant='contained' size="x-small" color="inherit" sx={{ px: 0, py: 1, minWidth: 40 }}>
            <Iconify icon="eva:edit-fill" sx={{ width: 20, height: 20 }} />
          </Button>
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
