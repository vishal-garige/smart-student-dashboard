import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ USE DEPLOYED BACKEND (IMPORTANT)
  const API = 'https://smart-student-dashboard-3idz.onrender.com/api/tasks';

  // Fetch tasks
  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title) return;
    try {
      await axios.post(API, { title });
      setTitle('');
      getTasks();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to add task');
    }
  };

  // Mark complete
  const markComplete = async (id) => {
    try {
      await axios.put(`${API}/${id}`, {
        status: 'completed'
      });
      getTasks();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getTasks();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to delete task');
    }
  };

  // Days ago
  const getDaysAgo = (date) => {
    const created = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Streak
  const getStreak = () => {
    const days = new Set(
      tasks.map(t => new Date(t.createdAt).toDateString())
    );

    const sorted = [...days].map(d => new Date(d)).sort((a, b) => b - a);

    let streak = 0;
    let current = new Date();

    for (let d of sorted) {
      const diff = Math.floor((current - d) / (1000 * 60 * 60 * 24));
      if (diff === 0 || diff === 1) {
        streak++;
        current = d;
      } else break;
    }

    return streak;
  };

  const streak = getStreak();

  // Filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });

  return (
    <div className="container">
      <h1>📊 Smart Student Dashboard</h1>

      {/* ERROR */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* Stats */}
      <div>
        <b>Total:</b> {totalTasks} |
        <b> Completed:</b> {completedTasks} |
        <b> Pending:</b> {pendingTasks} |
        🔥 <b>Streak:</b> {streak}
      </div>

      {/* Input */}
      <div className="inputBox">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {/* Tasks */}
      <div className="taskList">
        {filteredTasks.map(task => (
          <div className="card" key={task._id}>
            <div>
              <span className={task.status === 'completed' ? 'done' : ''}>
                {task.title}
              </span>
              <div style={{ fontSize: '12px', color: 'gray' }}>
                {getDaysAgo(task.createdAt)}
              </div>
            </div>

            <div className="actions">
              <button
                onClick={() => markComplete(task._id)}
                disabled={task.status === 'completed'}
              >
                ✓
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
