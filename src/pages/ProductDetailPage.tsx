import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Skeleton,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useProductsStore } from '@/stores/productsStore';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct: product, selectedProductLoading: loading, fetchProductById, clearSelectedProduct } =
    useProductsStore();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) fetchProductById(Number(id));
    return () => clearSelectedProduct();
  }, [id, fetchProductById, clearSelectedProduct]);

  if (loading || !product) {
    return (
      <Box>
        <Skeleton width={120} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        Back to Products
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={product.images?.[selectedImage] || product.thumbnail}
                alt={product.title}
                sx={{ width: '100%', height: 350, objectFit: 'contain', borderRadius: 2, bgcolor: '#F5F7FA', mb: 1 }}
              />
              {product.images && product.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {product.images.map((img, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      onClick={() => setSelectedImage(i)}
                      sx={{
                        width: 64, height: 64, objectFit: 'cover', borderRadius: 1, cursor: 'pointer',
                        border: selectedImage === i ? '2px solid' : '2px solid transparent',
                        borderColor: selectedImage === i ? 'primary.main' : 'transparent',
                        opacity: selectedImage === i ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h4" gutterBottom>{product.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label={product.category} color="primary" size="small" />
                {product.brand && <Chip label={product.brand} variant="outlined" size="small" />}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" color="primary" fontWeight={700}>${product.price}</Typography>
                {product.discountPercentage > 0 && (
                  <Chip label={`-${product.discountPercentage}%`} color="error" size="small" />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">({product.rating})</Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={1}>
                {[
                  { label: 'Stock', value: product.stock },
                  { label: 'SKU', value: product.sku },
                  { label: 'Weight', value: `${product.weight}g` },
                  { label: 'Warranty', value: product.warrantyInformation },
                  { label: 'Shipping', value: product.shippingInformation },
                  { label: 'Return Policy', value: product.returnPolicy },
                  { label: 'Status', value: product.availabilityStatus },
                  { label: 'Min Order', value: product.minimumOrderQuantity },
                ].map((spec) => (
                  <Grid size={{ xs: 6 }} key={spec.label}>
                    <Typography variant="caption" color="text.secondary">{spec.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{spec.value || '—'}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailPage;
