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

  // 🔥 BASE URL
  const BASE_URL = 'https://smart-student-dashboard-3idz.onrender.com';
  const TASK_API = `${BASE_URL}/api/tasks`;

  // 🔥 LOGIN
  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password }
      );

      // ✅ save token
      localStorage.setItem('token', res.data.token);

      // ✅ update login state
      setIsLoggedIn(true);

      setError('');

    } catch (err) {
      console.error(err);
      setError('Login failed');
    } finally {
      setLoading(false);
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

      const res = await axios.get(TASK_API, {
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
        TASK_API,
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
        `${TASK_API}/${id}`,
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
      await axios.delete(`${TASK_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      getTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ AUTO LOGIN (only set login state)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ FETCH TASKS AFTER LOGIN
  useEffect(() => {
    if (isLoggedIn) {
      getTasks();
    }
  }, [isLoggedIn]);

  // FILTER
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });

  return (
    <div className="container">

      <h1>📊 Smart Student Dashboard</h1>

      {/* LOGIN */}
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

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {/* DASHBOARD */}
      {isLoggedIn && (
        <>
          <button onClick={logout}>Logout</button>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* INPUT */}
          <div className="inputBox">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
            />
            <button onClick={addTask}>Add</button>
          </div>

          {/* FILTER */}
          <div className="filters">
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('pending')}>Pending</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
          </div>

          {/* TASKS */}
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
