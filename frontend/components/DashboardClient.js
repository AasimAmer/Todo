'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoItem from '@/components/TodoItem';
import { useAuth } from '@/context/AuthContext';
import { createTodo, deleteTodo, normalizeTodos, toggleTodo } from '@/lib/api';

export default function DashboardClient({ initialTodos }) {
  const { user, jwt, logout, loading } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState(() => normalizeTodos(initialTodos));
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const counts = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.isCompleted).length;
    return { total, completed, pending: total - completed };
  }, [todos]);

  const clearError = () => setError('');

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title || !jwt || busy) return;

    setBusy(true);
    setError('');
    try {
      const created = await createTodo(title, jwt);
      setTodos((prev) => [created, ...prev]);
      setNewTitle('');
    } catch (err) {
      setError(err.message || 'Failed to create todo');
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (todo) => {
    if (!jwt || busy) return;
    setBusy(true);
    setError('');
    try {
      const updated = await toggleTodo(todo, jwt);
      setTodos((prev) => prev.map((item) => (item.apiId === todo.apiId ? updated : item)));
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (todo) => {
    if (!jwt || busy) return;
    setBusy(true);
    setError('');
    try {
      await deleteTodo(todo, jwt);
      setTodos((prev) => prev.filter((item) => item.apiId !== todo.apiId));
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">My Todos</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.username || ''}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3 mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button type="button" onClick={clearError} className="text-red-400 hover:text-red-600 ml-4">
              ×
            </button>
          </div>
        ) : null}

        <div className="flex gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-semibold text-gray-800">{counts.total}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-semibold text-green-600">{counts.completed}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-semibold text-orange-500">{counts.pending}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Add a new task..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || busy || !jwt || !newTitle.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {busy ? 'Saving...' : 'Add'}
          </button>
        </form>

        {todos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.apiId} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
