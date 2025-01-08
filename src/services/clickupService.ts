// src/services/clickupService.ts

import { clickupApi } from './api';
import { ClickUpTask, ClickUpListResponse } from '../types/clickup.types';

class ClickUpService {
  // Get all tasks from a list
  static async getTasksFromList(listId: string): Promise<ClickUpTask[]> {
    try {
      const response = await clickupApi.get<ClickUpListResponse>(`/list/${listId}/task`);
      return response.data.tasks;
    } catch (error) {
      console.error('Error fetching ClickUp tasks:', error);
      throw error;
    }
  }

  // Get a specific task's details
  static async getTaskDetails(taskId: string): Promise<ClickUpTask> {
    try {
      const response = await clickupApi.get(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  }

  // Create a new task
  static async createTask(listId: string, taskData: {
    name: string;
    description?: string;
    assignees?: number[];
    status?: string;
    due_date?: number;
    priority?: number;
    tags?: string[];
  }) {
    try {
      const response = await clickupApi.post(`/list/${listId}/task`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update a task
  static async updateTask(taskId: string, updateData: {
    name?: string;
    description?: string;
    status?: string;
    priority?: number;
    due_date?: number;
    assignees?: number[];
  }) {
    try {
      const response = await clickupApi.put(`/task/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete a task
  static async deleteTask(taskId: string) {
    try {
      const response = await clickupApi.delete(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Get all lists in a space
  static async getLists(spaceId: string) {
    try {
      const response = await clickupApi.get(`/space/${spaceId}/list`);
      return response.data.lists;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  }

  // Get task comments
  static async getTaskComments(taskId: string) {
    try {
      const response = await clickupApi.get(`/task/${taskId}/comment`);
      return response.data.comments;
    } catch (error) {
      console.error('Error fetching task comments:', error);
      throw error;
    }
  }

  // Add comment to a task
  static async addTaskComment(taskId: string, comment: string) {
    try {
      const response = await clickupApi.post(`/task/${taskId}/comment`, {
        comment_text: comment
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
}

export default ClickUpService;