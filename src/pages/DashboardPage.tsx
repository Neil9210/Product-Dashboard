import React, { useEffect, useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  CardActionArea,
} from '@mui/material';
import { People, ShoppingCart, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface Stats {
  totalUsers: number;
  totalProducts: number;
}

const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('https://dummyjson.com/users?limit=1').then((r) => r.json()),
      fetch('https://dummyjson.com/products?limit=1').then((r) => r.json()),
    ]).then(([usersData, productsData]) => {
      setStats({ totalUsers: usersData.total, totalProducts: productsData.total });
      setLoading(false);
    });
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: stats?.totalUsers ?? 0,
        icon: <People sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />,
        path: '/users',
        color: '#E8EAF6',
      },
      {
        title: 'Total Products',
        value: stats?.totalProducts ?? 0,
        icon: <ShoppingCart sx={{ fontSize: 48, color: 'secondary.main', opacity: 0.7 }} />,
        path: '/products',
        color: '#FFF3E0',
      },
    ],
    [stats]
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's an overview of your admin dashboard.
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
            <Card>
              <CardActionArea onClick={() => navigate(card.path)}>
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                    {loading ? (
                      <Skeleton width={80} height={40} />
                    ) : (
                      <Typography variant="h4" fontWeight={700}>{card.value.toLocaleString()}</Typography>
                    )}
                  </Box>
                  <Box sx={{ bgcolor: card.color, borderRadius: 3, p: 1.5, display: 'flex' }}>
                    {card.icon}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
              <TrendingUp sx={{ fontSize: 48, opacity: 0.7 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Quick Tip</Typography>
                <Typography variant="body1" fontWeight={600}>Click any card to explore data</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
