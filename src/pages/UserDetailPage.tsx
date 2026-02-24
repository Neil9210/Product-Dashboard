import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Skeleton,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowBack, Email, Phone, Business, LocationOn } from '@mui/icons-material';
import { useUsersStore } from '@/stores/usersStore';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedUser: user, selectedUserLoading: loading, fetchUserById, clearSelectedUser } =
    useUsersStore();

  useEffect(() => {
    if (id) fetchUserById(Number(id));
    return () => clearSelectedUser();
  }, [id, fetchUserById, clearSelectedUser]);

  if (loading || !user) {
    return (
      <Box>
        <Skeleton width={120} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Avatar src={user.image} sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
              <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
              <Chip label={user.gender} size="small" sx={{ mt: 0.5, textTransform: 'capitalize' }} />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>Personal Info</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{user.phone}</Typography>
                </Box>
                <Typography variant="body2">
                  <strong>Age:</strong> {user.age} | <strong>DOB:</strong> {user.birthDate}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>Company</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Business fontSize="small" color="action" />
                <Typography variant="body2">{user.company?.name}</Typography>
              </Box>
              <Typography variant="body2"><strong>Department:</strong> {user.company?.department}</Typography>
              <Typography variant="body2"><strong>Title:</strong> {user.company?.title}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>Address</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2">
                  {user.address?.address}, {user.address?.city}, {user.address?.state} {user.address?.postalCode}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailPage;
