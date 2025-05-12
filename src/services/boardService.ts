import { Page, WhiteboardObject } from '../pages/WhiteBoard/Types/WhiteboardTypes';
import axios from 'axios';

export interface Board {
  _id: string;
  name: string;
  createdBy: string;
  collaborators: Array<{
    user: string;
    permission: 'view' | 'edit';
  }>;
  shapes: WhiteboardObject[];
  thumbnail_img: string;
  security: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collaborator {
  user: string;
  permission: 'view' | 'edit';
}

interface CreateBoardData {
  name: string;
  security: 'private' | 'public';
  collaborators: Collaborator[];
}

const API_URL = 'http://localhost:5000/api';

export const boardService = {
  // Get all boards for the current user
  async getBoards(): Promise<Board[]> {
    const response = await fetch(`${API_URL}/getBoards`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    return response.json();
  },

  // Get a single board by ID
  async getBoard(id: string): Promise<Board> {
    const response = await fetch(`${API_URL}/board/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch board');
    }
    return response.json();
  },

  // Create a new board
  async createBoard(boardData: CreateBoardData): Promise<{ _id: string }> {
    try {
      const response = await axios.post(`${API_URL}/createBoard`, boardData, { withCredentials: true});
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  },

  // Update an existing board
  async updateBoard(
    id: string,
    name: string,
    pages: Page[],
    security?: 'public' | 'private'
  ): Promise<Board> {
    // Convert pages to shapes format
    const shapes = pages.map(page => ({
      id: page.id,
      name: page.name,
      objects: page.objects,
      backgroundColor: page.backgroundColor
    }));

    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        shapes,
        ...(security && { security })
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update board');
    }
    return response.json();
  },

  // Delete a board
  async deleteBoard(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete board');
    }
  },

  // Search boards by name
  async searchBoards(query: string): Promise<Board[]> {
    const response = await fetch(`${API_URL}/boards/search/name?q=${encodeURIComponent(query)}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to search boards');
    }
    return response.json();
  },

  // Update board thumbnail
  async updateThumbnail(id: string, thumbnailData: string): Promise<Board> {
    const response = await fetch(`${API_URL}/boards/${id}/thumbnail`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ thumbnail_img: thumbnailData }),
    });

    if (!response.ok) {
      throw new Error('Failed to update thumbnail');
    }
    return response.json();
  },


  // Search users by name or email
  async searchUsers(query: string): Promise<User[]> {
    try {
      // Determine if it's an email or username
      const isEmail = query.includes('@');
  
      const paramName = isEmail ? 'email' : 'username';
  
      const response = await axios.get(`${API_URL}/user/search?${paramName}=${encodeURIComponent(query)}`, {
        withCredentials: true,
      });
  
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
  

}; 

export default boardService;