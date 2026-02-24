import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Avatar,
  Typography,
  Skeleton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUsersStore } from '@/stores/usersStore';

// Memoized table row to avoid unnecessary re-renders
const UserRow = React.memo(
  ({ user, onClick }: { user: any; onClick: () => void }) => (
    <TableRow
      hover
      onClick={onClick}
      sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={user.image} sx={{ width: 36, height: 36 }}>
            {user.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell sx={{ textTransform: 'capitalize' }}>{user.gender}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company?.name || '—'}</TableCell>
    </TableRow>
  )
);

const UsersListPage: React.FC = () => {
  const {
    users, total, isLoading, error, page, limit, search,
    setPage, setSearch, fetchUsers,
  } = useUsersStore();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchUsers();
  }, [page, search, fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput, setSearch]);

  const handleChangePage = useCallback(
    (_: unknown, newPage: number) => setPage(newPage),
    [setPage]
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>

      <TextField
        placeholder="Search users by name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        size="small"
        sx={{ mb: 2, maxWidth: 400, width: '100%' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onClick={() => navigate(`/users/${user.id}`)}
                  />
                ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </Box>
  );
};

export default UsersListPage;
