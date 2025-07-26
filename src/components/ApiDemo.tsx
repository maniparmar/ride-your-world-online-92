import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { todoApi, userApi, healthCheck, type Todo, type User } from '@/lib/api';
import { toast } from 'sonner';

export function ApiDemo() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const queryClient = useQueryClient();

  // Health check query
  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: healthCheck,
  });

  // Todos queries
  const { data: todosResponse, isLoading: todosLoading, refetch: refetchTodos } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoApi.getAll(),
  });

  const { data: usersResponse, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll(),
  });

  // Mutations
  const createTodoMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
      setNewTodoDescription('');
      toast.success('Todo created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create todo: ${error.message}`);
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: todoApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated!');
    },
    onError: (error) => {
      toast.error(`Failed to update todo: ${error.message}`);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted!');
    },
    onError: (error) => {
      toast.error(`Failed to delete todo: ${error.message}`);
    },
  });

  const createUserMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUserName('');
      setNewUserEmail('');
      toast.success('User created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted!');
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    createTodoMutation.mutate({
      title: newTodoTitle,
      description: newTodoDescription || undefined,
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    
    createUserMutation.mutate({
      name: newUserName,
      email: newUserEmail,
    });
  };

  const todos = todosResponse?.data || [];
  const users = usersResponse?.data || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Backend API Demo</h1>
        <div className="flex items-center gap-2">
          {healthLoading ? (
            <Badge variant="outline">Checking...</Badge>
          ) : health?.status === 'OK' ? (
            <Badge variant="default" className="bg-green-500">Backend Online</Badge>
          ) : (
            <Badge variant="destructive">Backend Offline</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Todos Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Todos</CardTitle>
                <CardDescription>Manage your todo list</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchTodos()}
                disabled={todosLoading}
              >
                <RefreshCw className={`h-4 w-4 ${todosLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create Todo Form */}
            <form onSubmit={handleCreateTodo} className="space-y-2">
              <Input
                placeholder="Todo title"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
              />
              <Button 
                type="submit" 
                disabled={!newTodoTitle.trim() || createTodoMutation.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </form>

            {/* Todos List */}
            <div className="space-y-2">
              {todosLoading ? (
                <p className="text-muted-foreground">Loading todos...</p>
              ) : todos.length === 0 ? (
                <p className="text-muted-foreground">No todos yet. Create one above!</p>
              ) : (
                todos.map((todo: Todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodoMutation.mutate(todo.id)}
                        disabled={toggleTodoMutation.isPending}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground">
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                      disabled={deleteTodoMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage users</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchUsers()}
                disabled={usersLoading}
              >
                <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create User Form */}
            <form onSubmit={handleCreateUser} className="space-y-2">
              <Input
                placeholder="Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <Button 
                type="submit" 
                disabled={!newUserName.trim() || !newUserEmail.trim() || createUserMutation.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </form>

            {/* Users List */}
            <div className="space-y-2">
              {usersLoading ? (
                <p className="text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-muted-foreground">No users yet. Create one above!</p>
              ) : (
                users.map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUserMutation.mutate(user.id)}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}