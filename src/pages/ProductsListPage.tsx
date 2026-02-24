import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Rating,
  Chip,
  Alert,
  Pagination,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '@/stores/productsStore';

const ProductCard = React.memo(
  ({ product, onClick }: { product: any; onClick: () => void }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia component="img" height={180} image={product.thumbnail} alt={product.title} sx={{ objectFit: 'cover' }} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" noWrap fontWeight={600}>{product.title}</Typography>
          <Chip label={product.category} size="small" sx={{ mt: 0.5, mb: 1, fontSize: '0.7rem' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary" fontWeight={700}>${product.price}</Typography>
            <Rating value={product.rating} size="small" precision={0.5} readOnly />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
);

const ProductsListPage: React.FC = () => {
  const {
    products, total, isLoading, error, page, limit, search, category,
    categories, setPage, setSearch, setCategory, fetchProducts, fetchCategories,
  } = useProductsStore();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [page, search, category, fetchProducts]);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput, setSearch]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => setPage(value - 1),
    [setPage]
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Products</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.slug} value={cat.slug}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Skeleton variant="rounded" height={280} />
              </Grid>
            ))
          : products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <ProductCard product={product} onClick={() => navigate(`/products/${product.id}`)} />
              </Grid>
            ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default ProductsListPage;
