import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Plus, CheckCircle } from 'lucide-react';

export default function TaskDashboard() {
  const { user, logout, getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para obtener tareas desde Node.js
  const fetchTasks = async () => {
    const token = await getToken();
    const response = await fetch(`${apiUrl}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` } // ¡Aquí inyectamos el JWT!
    });
    const data = await response.json();
    setTasks(data);
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const token = await getToken();
    await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTask })
    });
    setNewTask('');
    fetchTasks(); // Recargamos la lista
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">DevSecOps TaskHub</h1>
          <p className="text-sm text-gray-500">Hola, {user.displayName || user.email}</p>
        </div>
        <button onClick={logout} className="flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition">
          <LogOut size={18} className="mr-2" /> Salir
        </button>
      </header>

      <form onSubmit={addTask} className="flex mb-6 gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="¿Qué vamos a aprender hoy?"
          className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center transition">
          <Plus size={20} className="mr-1" /> Agregar
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No hay tareas. ¡Agrega una!</p>
        ) : (
          <ul>
            {tasks.map(task => (
              <li key={task.id} className="border-b last:border-0 p-4 flex items-center">
                <CheckCircle size={20} className="text-gray-300 mr-3" />
                <span className="text-gray-700">{task.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}