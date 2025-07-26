import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

export const todosRouter = Router();

// In-memory storage for demo purposes
let todos: Array<{
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: 1,
    title: 'Setup backend server',
    description: 'Create Express server with TypeScript',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Create API endpoints',
    description: 'Build REST API for frontend communication',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/todos - Get all todos
todosRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { completed, search } = req.query;
  
  let filteredTodos = [...todos];
  
  // Filter by completion status
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTodos = filteredTodos.filter(todo => todo.completed === isCompleted);
  }
  
  // Search in title and description
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase();
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower))
    );
  }
  
  res.json({
    success: true,
    data: filteredTodos,
    count: filteredTodos.length,
    total: todos.length
  });
}));

// GET /api/todos/:id - Get todo by ID
todosRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  res.json({
    success: true,
    data: todo
  });
}));

// POST /api/todos - Create new todo
todosRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    description: description?.trim() || undefined,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  
  res.status(201).json({
    success: true,
    data: newTodo
  });
}));

// PUT /api/todos/:id - Update todo
todosRouter.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  // Update todo
  const todo = todos[todoIndex];
  if (title !== undefined) todo.title = title.trim();
  if (description !== undefined) todo.description = description?.trim() || undefined;
  if (completed !== undefined) todo.completed = Boolean(completed);
  todo.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: todo
  });
}));

// PATCH /api/todos/:id/toggle - Toggle todo completion
todosRouter.patch('/:id/toggle', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  // Toggle completion
  const todo = todos[todoIndex];
  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: todo
  });
}));

// DELETE /api/todos/:id - Delete todo
todosRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTodo,
    message: 'Todo deleted successfully'
  });
}));