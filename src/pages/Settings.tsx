import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Avatar,
  Hidden,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import db from '../firebase/firebaseConfig';
import { Session } from 'inspector/promises';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';

// Mock data for the admin profile
const adminProfile = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  photoUrl: '/placeholder.svg?height=100&width=100',
  password: '********', // In a real app, we wouldn't store or display actual passwords
};

function AdminSettingsPage({session}: {session: Session, logout: () => void}) {
  const [users, setUsers] = useState<any[]>([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState({ ...adminProfile });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', photoUrl: '', password: '' });

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnapShot = await getDocs(collection(db, 'users-authentication'));
        const usersData = userSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };
    fetchUsers();
  }, []);

  const handleEditProfile = () => {
    setOpenEditProfile(true);
  };

  const handleSaveProfile = () => {
    // Here you would typically send the updated profile to your backend
    console.log('Saving profile:', editedProfile);
    setOpenEditProfile(false);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setOpenEditUser(true);
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        const userDoc = doc(db, 'users-authentication', selectedUser.id);
        await updateDoc(userDoc, selectedUser);
        setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
        setOpenEditUser(false);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  };

  const handleAddUser = () => {
    setOpenAddUser(true);
  };

  const handleSaveNewUser = async () => {
    try {
      const docRef = await addDoc(collection(db, 'users-authentication'), newUser);
      setUsers([...users, { id: docRef.id, ...newUser }]);
      setOpenAddUser(false);
      setNewUser({ name: '', email: '', role: '', photoUrl: '', password: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users-authentication', id));
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Profile
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar src={session.photoUrl} alt={adminProfile.name} sx={{ width: 100, height: 100, mr: 2 }} />
          <Box>
            <Typography><strong>Name:</strong> {adminProfile.name}</Typography>
            <Typography><strong>Email:</strong> {adminProfile.email}</Typography>
            <Typography><strong>Role:</strong> {adminProfile.role}</Typography>
          </Box>
        </Box>
        <Button variant="contained" onClick={handleEditProfile} startIcon={<EditIcon />}>
          Edit Profile
        </Button>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }} hidden = {session.role !== 'Editor'}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            User Management
          </Typography>
          <Button variant="contained" color="primary" onClick={handleAddUser} startIcon={<AddIcon />}>
            Add User
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar src={user.photoUrl} alt={user.name} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditUser(user)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editedProfile.name}
            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editedProfile.email}
            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Photo URL"
            fullWidth
            value={editedProfile.photoUrl}
            onChange={(e) => setEditedProfile({ ...editedProfile, photoUrl: e.target.value })}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={editedProfile.password}
            onChange={(e) => setEditedProfile({ ...editedProfile, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditUser} onClose={() => setOpenEditUser(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Photo URL"
            fullWidth
            value={selectedUser?.photoUrl || ''}
            onChange={(e) => setSelectedUser({ ...selectedUser, photoUrl: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedUser?.role || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            >
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditUser(false)}>Cancel</Button>
          <Button onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openAddUser} onClose={() => setOpenAddUser(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Photo URL"
            fullWidth
            value={newUser.photoUrl}
            onChange={(e) => setNewUser({ ...newUser, photoUrl: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUser(false)}>Cancel</Button>
          <Button onClick={handleSaveNewUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSettingsPage;