# Full-Stack React + Express TypeScript Application

A modern full-stack application with React frontend using Vite + TypeScript + shadcn/ui components and Express backend with TypeScript.

## 🚀 Features

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for beautiful, accessible UI components
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React Router** for client-side routing
- **Sonner** for toast notifications

### Backend
- **Express.js** with TypeScript
- **CORS** enabled for frontend communication
- **Error handling** middleware
- **RESTful API** design
- **In-memory data storage** (easily replaceable with a database)

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   └── ...
├── server/                # Backend source code
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   └── index.ts          # Server entry point
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (18+ recommended)
- npm or yarn package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

The default configuration should work for local development:
```env
# Backend Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Development Servers

#### Option A: Start Both Frontend and Backend Together
```bash
npm run dev:full
```

#### Option B: Start Separately
Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **API Demo Page**: http://localhost:5173/api-demo

## 📖 Available Scripts

### Development
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend development server
- `npm run dev:full` - Start both frontend and backend concurrently

### Building
- `npm run build` - Build frontend for production
- `npm run server:build` - Build backend for production
- `npm run build:full` - Build both frontend and backend

### Production
- `npm run preview` - Preview frontend build locally
- `npm run server:start` - Start production backend server

### Utilities
- `npm run lint` - Lint frontend code

## 🔌 API Endpoints

### Health Check
- `GET /health` - Check server status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Todos
- `GET /api/todos` - Get all todos (supports ?completed=true/false and ?search=term)
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete todo

## 🎯 API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create a Todo
```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "description": "Complete TypeScript tutorial"}'
```

### Get All Todos
```bash
curl http://localhost:3001/api/todos
```

## 🔧 Frontend Integration

The frontend includes a complete API client in `src/lib/api.ts` with TypeScript interfaces:

```typescript
import { userApi, todoApi, healthCheck } from '@/lib/api';

// Get all users
const users = await userApi.getAll();

// Create a todo
const newTodo = await todoApi.create({
  title: "My new todo",
  description: "Optional description"
});

// Check backend health
const health = await healthCheck();
```

## 🎨 Demo Page

Visit `/api-demo` to see a fully functional demo that showcases:
- Real-time backend connectivity status
- CRUD operations for users and todos
- Form handling with validation
- Loading states and error handling
- Toast notifications
- Beautiful UI with shadcn/ui components

## 🚀 Production Deployment

### Backend Deployment
1. Build the backend: `npm run server:build`
2. Set production environment variables
3. Start the server: `npm run server:start`

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Serve the `dist` folder with any static file server
3. Update `VITE_API_URL` to point to your production backend

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api
```

## 🗄️ Database Integration

The current setup uses in-memory storage for simplicity. To integrate a real database:

1. Install your preferred database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Replace the in-memory arrays in route files with database queries
3. Add connection configuration to environment variables
4. Create database models/schemas as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.
