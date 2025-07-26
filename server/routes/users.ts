import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

export const usersRouter = Router();

// In-memory storage for demo purposes
// In a real app, you'd use a database
let users: Array<{
  id: number;
  name: string;
  email: string;
  createdAt: string;
}> = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/users - Get all users
usersRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
}));

// GET /api/users/:id - Get user by ID
usersRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
}));

// POST /api/users - Create new user
usersRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser
  });
}));

// PUT /api/users/:id - Update user
usersRouter.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  // Check if email already exists for another user
  if (email) {
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
  }
  
  // Update user
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json({
    success: true,
    data: users[userIndex]
  });
}));

// DELETE /api/users/:id - Delete user
usersRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
    message: 'User deleted successfully'
  });
}));