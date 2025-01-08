import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Hidden,
} from '@mui/material';
import {
  Search as SearchIcon,
  Folder as FolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Session } from 'inspector/promises';

// Mock data for categories and articles
const initialCategories = [
  { id: 1, name: 'Barcode Scanner', count: 2 },
  { id: 2, name: 'CDS', count: 2 },
  { id: 3, name: 'Central', count: 2 },
  { id: 4, name: 'Getorders', count: 2 },
  { id: 5, name: 'Cloud', count: 2 }
];

const initialArticles = [
  {
    id: 1,
    title: "Troubleshooting Barcode Scanners",
    content: `
      <h4 className="font-bold">Problem</h4>
      <p>The barcode scanner is not scanning items correctly.</p>
      <h4>Solution</h4>
      <p>Try the following steps to troubleshoot the issue:</p>
      <ol>
        <li>Check the scanner's connection to the device.</li>
        <li>Ensure the scanner is properly configured.</li>
        <li>Update the scanner's firmware.</li>
        <li>Test the scanner with a different device.</li>
      </ol>
    `,
    category: "Barcode Scanner",
  },
  {
    id: 2,
    title: "Setting Up CDS on iOS Devices",
    content: `
      <h2>Problem</h2>
      <p>Unable to set up CDS on iOS devices.</p>
      <h2>Solution</h2>
      <p>Follow these steps to configure CDS on iOS:</p>
      <ol>
        <li>Download the CDS app from the App Store.</li>
        <li>Open the app and sign in with your account.</li>
        <li>Follow the on-screen instructions to complete the setup.</li>
        <li>For further assistance, contact our support team.</li>
      </ol>
    `,
    category: "CDS",
  },
  {
    id: 3,
    title: "Optimizing Central Cloud Performance",
    content: `
      <h2>Problem</h2>
      <p>Central Cloud is running slow or experiencing lag.</p>
      <h2>Solution</h2>
      <p>Improve Central Cloud performance with these tips:</p>
      <ol>
        <li>Check your internet connection speed.</li>
        <li>Reduce the number of active users on the platform.</li>
        <li>Clear cache and cookies in your browser.</li>
        <li>Upgrade your subscription plan for more resources.</li>
      </ol>
    `,
    category: "Central",
  },
  {
    id: 4,
    title: "Resolving Connection Issues in GetOrders",
    content: `
      <h2>Problem</h2>
      <p>GetOrders is unable to connect to the server.</p>
      <h2>Solution</h2>
      <p>Fix connection problems in GetOrders with these steps:</p>
      <ol>
        <li>Check your internet connection.</li>
        <li>Verify the server address and port settings.</li>
        <li>Update the GetOrders app to the latest version.</li>
        <li>Restart your device and try again.</li>
      </ol>
    `,
    category: "Getorders",
  },
  {
    id: 5,
    title: "Best Practices for Cloud Printer Management",
    content: `
      <h2>Problem</h2>
      <p>Learn how to manage cloud printers effectively.</p>
      <h2>Solution</h2>
      <p>Follow these best practices for cloud printer management:</p>
      <ol>
        <li>Use a reliable cloud printing service.</li>
        <li>Secure your printers with strong passwords.</li>
        <li>Monitor printer usage and supplies regularly.</li>
        <li>Train employees on proper printer maintenance.</li>
      </ol>
    `,
    category: "Cloud",
  },
  {
    id: 6,
    title: "Barcode Scanner Calibration Guide",
    content: `
      <h2>Problem</h2>
      <p>The barcode scanner is not reading barcodes accurately.</p>
      <h2>Solution</h2>
      <p>Calibrate the scanner using these steps:</p>
      <ol>
        <li>Access the scanner's calibration settings.</li>
        <li>Follow the on-screen instructions to calibrate the scanner.</li>
        <li>Test the scanner with different barcodes to ensure accuracy.</li>
        <li>Repeat the calibration process if needed.</li>
      </ol>
    `,
    category: "Barcode Scanner",
  },
  {
    id: 7,
    title: "CDS Android: Troubleshooting Connectivity",
    content: `
      <h2>Problem</h2>
      <p>CDS on Android devices is unable to connect to the server.</p>
      <h2>Solution</h2>
      <p>Resolve connectivity issues with CDS on Android:</p>
      <ol>
        <li>Check your device's internet connection.</li>
        <li>Verify the server settings in the CDS app.</li>
        <li>Update the app to the latest version.</li>
        <li>Restart your device and try again.</li>
      </ol>
    `,
    category: "CDS",
  },
  {
    id: 8,
    title: "How to Use Central for Real-Time Updates",
    content: `
      <h2>Problem</h2>
      <p>Learn how to receive real-time updates in Central.</p>
      <h2>Solution</h2>
      <p>Follow these steps to enable real-time updates:</p>
      <ol>
        <li>Go to the settings menu in Central.</li>
        <li>Enable the real-time updates option.</li>
        <li>Save the changes and refresh the page.</li>
        <li>You will now receive live updates in Central.</li>
      </ol>
    `,
    category: "Central",
  },
  {
    id: 9,
    title: "Fixing Sync Issues in GetOrders",
    content: `
      <h2>Problem</h2>
      <p>GetOrders is not syncing data between devices.</p>
      <h2>Solution</h2>
      <p>Resolve sync problems in GetOrders with these steps:</p>
      <ol>
        <li>Check your internet connection on all devices.</li>
        <li>Verify the sync settings in the app.</li>
        <li>Update the app to the latest version.</li>
        <li>Restart the devices and try syncing again.</li>
      </ol>
    `,
    category: "Getorders",
  },
  {
    id: 10,
    title: "Cloud Printer Setup for Beginners",
    content: `
      <h2>Problem</h2>
      <p>Learn how to set up cloud printers for your business.</p>
      <h2>Solution</h2>
      <p>Follow these steps to configure cloud printers:</p>
      <ol>
        <li>Choose a cloud printing service provider.</li>
        <li>Install the necessary drivers and software.</li>
        <li>Connect the printers to your network.</li>
        <li>Test the printers with sample documents.</li>
      </ol>
    `,
    category: "Cloud",
  },
];

function KnowledgeBase({session}: {session: Session}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState(0);
  const [categoriesState, setCategoriesState] = useState(initialCategories);
  const [articlesState, setArticlesState] = useState(initialArticles);

  // New state for dialogs
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [addIssueDialogOpen, setAddIssueDialogOpen] = useState(false);
  const [editIssueDialogOpen, setEditIssueDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'category' | 'issue'>('category');
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  // New state for form inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueCategory, setNewIssueCategory] = useState('');
  const [newIssueProblem, setNewIssueProblem] = useState('');
  const [newIssueSolution, setNewIssueSolution] = useState('');
  const [editIssueId, setEditIssueId] = useState<number | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const filteredArticles = articlesState.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedCategory || article.category === selectedCategory)
  );

  const handleArticleClick = (articleId: number) => {
    setArticleId(articleId - 1);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName) {
      const newCategory = {
        id: categoriesState.length + 1,
        name: newCategoryName,
        count: 0,
      };
      setCategoriesState([...categoriesState, newCategory]);
      setNewCategoryName('');
      setAddCategoryDialogOpen(false);
    }
  };

  const handleAddIssue = () => {
    if (newIssueTitle && newIssueCategory && newIssueProblem && newIssueSolution) {
      const newArticle = {
        id: articlesState.length + 1,
        title: newIssueTitle,
        content: `
          <h4 className="font-bold">Problem</h4>
          <p>${newIssueProblem}</p>
          <h4>Solution</h4>
          <p>${newIssueSolution}</p>
        `,
        category: newIssueCategory,
      };
      setArticlesState([...articlesState, newArticle]);
      setNewIssueTitle('');
      setNewIssueCategory('');
      setNewIssueProblem('');
      setNewIssueSolution('');
      setAddIssueDialogOpen(false);
    }
  };

  const handleEditIssue = () => {
    if (editIssueId !== null) {
      const updatedArticles = articlesState.map(article => 
        article.id === editIssueId
          ? {
              ...article,
              title: newIssueTitle || article.title,
              category: newIssueCategory || article.category,
              content: `
                <h4 className="font-bold">Problem</h4>
                <p>${newIssueProblem || article.content}</p>
                <h4>Solution</h4>
                <p>${newIssueSolution || article.content}</p>
              `
            }
          : article
      );
      setArticlesState(updatedArticles);
      setEditIssueDialogOpen(false);
      resetFormFields();
    }
  };

  const handleDelete = () => {
    if (deleteType === 'category' && deleteItemId) {
      setCategoriesState(categoriesState.filter(category => category.id !== deleteItemId));
      setArticlesState(articlesState.filter(article => article.category !== categoriesState.find(c => c.id === deleteItemId)?.name));
    } else if (deleteType === 'issue' && deleteItemId) {
      setArticlesState(articlesState.filter(article => article.id !== deleteItemId));
    }
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  const resetFormFields = () => {
    setNewIssueTitle('');
    setNewIssueCategory('');
    setNewIssueProblem('');
    setNewIssueSolution('');
    setEditIssueId(null);
  };

  return (
    <div className='mt-2'>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2} hidden={session?.role !== 'Editor'}>
        <Grid item xs={12}>
          <CardContent className='border border-muted p-4 mb-4 shadow-sm'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddCategoryDialogOpen(true)}
                  sx={{ mr: 2 }}
                  fullWidth
                >
                  Add Category
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddIssueDialogOpen(true)}
                  sx={{ mr: 2 }}
                  fullWidth
                >
                  Add Issue
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditIssueDialogOpen(true)}
                  sx={{ mr: 2 }}
                  fullWidth
                >
                  Edit Issue
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setDeleteType('category');
                    setDeleteDialogOpen(true);
                  }}
                  sx={{ mr: 2 }}
                  fullWidth
                >
                  Delete Category
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setDeleteType('issue');
                    setDeleteDialogOpen(true);
                  }}
                  fullWidth
                >
                  Delete Issue
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <List>
              <ListItem>
                <Typography variant="h6">Categories</Typography>
              </ListItem>
              {categoriesState.map((category) => (
                <ListItem
                  button
                  key={category.id}
                  selected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                  <Chip label={category.count} size="small" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Articles
          </Typography>
          {filteredArticles.length === 0 ? (
            <Typography color="text.secondary">
              No articles found. Try adjusting your search or category selection.
            </Typography>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article.id} sx={{ mb: 2 }} onClick={() => handleArticleClick(article.id)}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {article.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Chip label={article.category} size="small" color="primary" sx={{ mr: 1 }} />
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>

        {/* Article Content Dialog */}
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" fontWeight={'bold'}>
            {articlesState[articleId]?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              dangerouslySetInnerHTML={{ __html: articlesState[articleId]?.content || '' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={addCategoryDialogOpen} onClose={() => setAddCategoryDialogOpen(false)}>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              type="text"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add</Button>
          </DialogActions>
        </Dialog>

        {/* Add Issue Dialog */}
        <Dialog open={addIssueDialogOpen} onClose={() => setAddIssueDialogOpen(false)}>
          <DialogTitle>Add New Issue</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Issue Title"
              type="text"
              fullWidth
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={newIssueCategory}
                onChange={(e) => setNewIssueCategory(e.target.value)}
              >
                {categoriesState.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Problem"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newIssueProblem}
              onChange={(e) => setNewIssueProblem(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Solution Steps"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newIssueSolution}
              onChange={(e) => setNewIssueSolution(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddIssueDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddIssue}>Add</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Issue Dialog */}
        <Dialog open={editIssueDialogOpen} onClose={() => setEditIssueDialogOpen(false)}>
          <DialogTitle>Edit Issue</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Select Issue to Edit</InputLabel>
              <Select
                value={editIssueId || ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setEditIssueId(id);
                  const issue = articlesState.find(a => a.id === id);
                  if (issue) {
                    setNewIssueTitle(issue.title);
                    setNewIssueCategory(issue.category);
                    setNewIssueProblem(issue.content);
                    setNewIssueSolution(issue.content);
                  }
                }}
              >
                {articlesState.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    {article.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Issue Title"
              type="text"
              fullWidth
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={newIssueCategory}
                onChange={(e) => setNewIssueCategory(e.target.value)}
              >
                {categoriesState.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Problem"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newIssueProblem}
              onChange={(e) => setNewIssueProblem(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Solution Steps"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newIssueSolution}
              onChange={(e) => setNewIssueSolution(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditIssueDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditIssue}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </DialogContentText>
            <FormControl fullWidth margin="dense">
              <InputLabel>Select {deleteType} to Delete</InputLabel>
              <Select
                value={deleteItemId || ''}
                onChange={(e) => setDeleteItemId(Number(e.target.value))}
              >
                {deleteType === 'category'
                  ? categoriesState.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))
                  : articlesState.map((article) => (
                      <MenuItem key={article.id} value={article.id}>
                        {article.title}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
}

export default KnowledgeBase;

