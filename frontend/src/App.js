import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 YOUR BACKEND URL
  const API = 'https://smart-student-dashboard-3idz.onrender.com/api/tasks';

  // 🔥 LOGIN
  const login = async () => {
    try {
      const res = await axios.post(
        'https://smart-student-dashboard-3idz.onrender.com/api/auth/login',
        { email, password }
      );

      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      getTasks();

    } catch (err) {
      console.error(err);
      setError('Login failed');
    }
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTasks([]);
  };

  // 🔥 GET TASKS
  const getTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTasks(res.data);
      setError('');

    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADD TASK
  const addTask = async () => {
    if (!title) return;

    try {
      await axios.post(
        API,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTitle('');
      getTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 COMPLETE TASK
  const markComplete = async (id) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      getTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      getTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      getTasks();
    }
  }, []);

  // FILTER
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });

  return (
    <div className="container">

      <h1>📊 Smart Student Dashboard</h1>

      {/* LOGIN SCREEN */}
      {!isLoggedIn && (
        <div>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      )}

      {/* DASHBOARD */}
      {isLoggedIn && (
        <>
          <button onClick={logout}>Logout</button>

          {error && <div style={{ color: 'red' }}>{error}</div>}
          {loading && <p>Loading...</p>}

          {/* INPUT */}
          <div className="inputBox">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
            />
            <button onClick={addTask}>Add</button>
          </div>

          {/* FILTERS */}
          <div className="filters">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('pending')}>Pending</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
          </div>

          {/* TASK LIST */}
          <div className="taskList">
            {filteredTasks.map(task => (
              <div className="card" key={task._id}>
                <span className={task.status === 'completed' ? 'done' : ''}>
                  {task.title}
                </span>

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
        </>
      )}
    </div>
  );
}

export default App;
