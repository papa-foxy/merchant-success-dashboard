import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import db from '../firebase/firebaseConfig';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Checkbox,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function DailyTicket() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketType, setTicketType] = useState('regular');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [currentTicket, setCurrentTicket] = useState<any | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        console.log(`Fetching tickets for type: ${ticketType}-daily-tickets`);
        const querySnapshot = await getDocs(collection(db, `${ticketType}-daily-tickets`));
        const fetchedTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched Tickets:', fetchedTickets); // Debugging: Log fetched tickets
        setTickets(fetchedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [ticketType]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `${ticketType}-daily-tickets`), (snapshot) => {
      const updatedTickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Real-time update:', updatedTickets); // Debugging: Log real-time updates
      setTickets(updatedTickets);
    });

    return () => unsubscribe();
  }, [ticketType]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newTicket = Object.fromEntries(formData.entries());
    try {
      if (currentTicket?.id) {
        const ticketDoc = doc(db, `${ticketType}-daily-tickets`, currentTicket.id);
        console.log('Updating ticket:', newTicket); // Debugging: Log update ticket data
        await updateDoc(ticketDoc, newTicket);
        console.log('Ticket updated successfully');
      } else {
        console.log('Adding new ticket:', newTicket); // Debugging: Log new ticket data
        await addDoc(collection(db, `${ticketType}-daily-tickets`), newTicket);
        console.log('Ticket added successfully');
      }
      event.target.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding/updating ticket:', error);
    }
  };

  const handleEdit = (ticket: any) => {
    setCurrentTicket(ticket);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ticketDoc = doc(db, `${ticketType}-daily-tickets`, id);
    try {
      await deleteDoc(ticketDoc);
      console.log(`Ticket with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleClickOpen = () => {
    setCurrentTicket(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePendingOpen = () => {
    setPendingOpen(true);
  };

  const handlePendingClose = () => {
    setPendingOpen(false);
  };

  const handleCellEditCommit = async (params: any) => {
    const { id, field, value } = params;
    const ticketDoc = doc(db, `${ticketType}-daily-tickets`, id);
    try {
      console.log(`Updating ticket ${id}: ${field} = ${value}`); // Debugging: Log update details
      await updateDoc(ticketDoc, { [field]: value });
      console.log(`Ticket with ID ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleRowClick = (params: any) => {
    setSelectedTicket(params.row);
  };

  const handleSelectedTicketClose = () => {
    setSelectedTicket(null);
  };

  const columns = [
    { field: 'ID', headerName: 'ID', width: 150, editable: true },
    { field: 'incoming_ticket_date', headerName: 'Incoming Ticket Date', width: 150, editable: true },
    { field: 'incoming_ticket_time', headerName: 'Incoming Ticket Time', width: 150, editable: true },
    { field: 'Outlet_Name', headerName: 'Outlet Name', width: 150, editable: true },
    { field: 'Category_1', headerName: 'Category 1', width: 150, editable: true },
    { field: 'Category_2', headerName: 'Category 2', width: 150, editable: true },
    {
      field: 'CSAT_Sent',
      headerName: 'CSAT Sent',
      width: 150,
      editable: true,
      renderCell: (params: any) => (
        <Checkbox
          checked={params.value}
          onChange={(e) => handleCheckboxChange(e, params)}
          color="primary"
        />
      ),
    },
    { field: 'CSAT_1', headerName: 'CSAT 1', width: 150, editable: true },
    { field: 'CSAT_2', headerName: 'CSAT 2', width: 150, editable: true },
    { field: 'Click_Up_Link', headerName: 'Click Up Link', width: 150, editable: true },
    { field: 'Date_Closed', headerName: 'Date Closed', width: 150, editable: true },
    { field: 'Issue', headerName: 'Issue', width: 150, editable: true },
    { field: 'Merchant_PIC', headerName: 'Merchant PIC', width: 150, editable: true },
    { field: 'Month', headerName: 'Month', width: 150, editable: true },
    { field: 'PIC_Name', headerName: 'PIC Name', width: 150, editable: true },
    { field: 'Reason_for_Pending', headerName: 'Reason for Pending', width: 150, editable: true },
    { field: 'Remark_Dissatisfied_1', headerName: 'Remark Dissatisfied 1', width: 150, editable: true },
    { field: 'Remark_Dissatisfied_2', headerName: 'Remark Dissatisfied 2', width: 150, editable: true },
    { field: 'Remarks', headerName: 'Remarks', width: 150, editable: true },
    { field: 'Status', headerName: 'Status', width: 150, editable: true },
    { field: 'Time_Stamp_Last_Interaction', headerName: 'Time Stamp Last Interaction', width: 150, editable: true },
    { field: 'Time_stamp', headerName: 'Time Stamp', width: 150, editable: true },
    { field: 'Week', headerName: 'Week', width: 150, editable: true },
    { field: 'interaction_type', headerName: 'Interaction Type', width: 150, editable: true },
    {
      field: 'Action',
      headerName: 'Action',
      width: 150,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  
  // Checkbox change handler
  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, params: any) => {
    const { id, field } = params;
    const ticketDoc = doc(db, `${ticketType}-daily-tickets`, id);
    try {
      console.log(`Updating ticket ${id}: ${field} = ${event.target.checked}`); // Debugging: Log update details
      await updateDoc(ticketDoc, { [field]: event.target.checked });
      console.log(`Ticket with ID ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    Object.values(ticket).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredPendingTickets = tickets.filter(ticket =>
    ticket.Status === 'Pending' &&
    (!startDate || new Date(ticket.incoming_ticket_date) >= new Date(startDate)) &&
    (!endDate || new Date(ticket.incoming_ticket_date) <= new Date(endDate))
  );

  const fieldLabels = {
    CSAT_1: "CSAT 1",
    CSAT_2: "CSAT 2",
    CSAT_Sent: "CSAT Sent",
    Category_1: "Category 1",
    Category_2: "Category 2",
    Click_Up_Link: "Click Up Link",
    Date_Closed: "Date Closed",
    ID: "ID",
    Issue: "Issue",
    Merchant_PIC: "Merchant PIC",
    Month: "Month",
    Outlet_Name: "Outlet Name",
    PIC_Name: "PIC Name",
    Reason_for_Pending: "Reason for Pending",
    Remark_Dissatisfied_1: "Remark Dissatisfied 1",
    Remark_Dissatisfied_2: "Remark Dissatisfied 2",
    Remarks: "Remarks",
    Status: "Status",
    Time_Stamp_Last_Interaction: "Time Stamp Last Interaction",
    Time_stamp: "Time Stamp",
    Week: "Week",
    incoming_ticket_date: "Incoming Ticket Date",
    incoming_ticket_time: "Incoming Ticket Time",
    interaction_type: "Interaction Type"
  };

  return (
    <div className='m-2'>
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" onClick={handleClickOpen} fullWidth>
              Create Ticket
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="secondary" onClick={handlePendingOpen} fullWidth>
              Show Pending Tickets
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="ticketType-label">Ticket Type</InputLabel>
              <Select
                labelId="ticketType-label"
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
              >
                <MenuItem value="regular">Regular Customer Daily Ticket</MenuItem>
                <MenuItem value="plus">Plus Customer Daily Ticket</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>
      </Box>

      <Box style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredTickets}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentTicket ? 'Edit Ticket' : 'Create Ticket'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {columns
                .filter(column => column.headerName !== 'Action')
                .map((column, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <TextField
                      fullWidth
                      label={column.headerName}
                      name={column.field}
                      value={currentTicket ? currentTicket[column.field] || '' : ''}
                      onChange={(e) => setCurrentTicket({ ...currentTicket, [column.field]: e.target.value })}
                    />
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={pendingOpen} onClose={handlePendingClose}>
        <DialogTitle>Pending Tickets</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Box mt={3} style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredPendingTickets}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              onRowClick={handleRowClick}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePendingClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {selectedTicket && (
        <Dialog open={Boolean(selectedTicket)} onClose={handleSelectedTicketClose}>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {Object.entries(selectedTicket).map(([key, value], i) => (
                <Grid item xs={12} key={i}>
                  <Typography variant="body1"><strong>{fieldLabels[key] || key}:</strong> {value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSelectedTicketClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default DailyTicket;