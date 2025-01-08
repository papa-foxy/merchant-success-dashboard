// src/components/ClickUpTaskList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Chip
} from '@mui/material';
import ClickUpService from '../services/clickupService';

interface ClickUpTaskListProps {
  listId: string;
}

const ClickUpTaskList: React.FC<ClickUpTaskListProps> = ({ listId }) => {
  const [tasks, setTasks] = useState<ClickUpTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [listId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await ClickUpService.getTasksFromList(listId);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignees</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                <Chip
                  label={task.status.status}
                  style={{ backgroundColor: task.status.color }}
                />
              </TableCell>
              <TableCell>
                {task.assignees.map(assignee => assignee.username).join(', ')}
              </TableCell>
              <TableCell>
                {new Date(task.date_created).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(task.date_updated).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClickUpTaskList;