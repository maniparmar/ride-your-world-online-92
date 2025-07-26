import { Router } from 'express';
import { usersRouter } from './users.js';
import { todosRouter } from './todos.js';

export const apiRouter = Router();

// API version and info
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      todos: '/api/todos',
      health: '/health'
    }
  });
});

// Mount route modules
apiRouter.use('/users', usersRouter);
apiRouter.use('/todos', todosRouter);