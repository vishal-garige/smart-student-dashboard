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
  const [isSignup, setIsSignup] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://smart-student-dashboard-3idz.onrender.com';
  const TASK_API = `${BASE_URL}/api/tasks`;

  // 🔐 LOGIN
  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
      setError('');

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 🆕 SIGNUP
  const signup = async () => {
    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/auth/signup`, {
        email,
        password
      });

      setError('Signup successful! Please login.');
      setIsSignup(false);

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTasks([]);
  };

  // 📦 GET TASKS
  const getTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(TASK_API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Tasks:', res.data); // DEBUG
      setTasks(res.data);
      setError('');

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // ➕ ADD TASK
  const addTask = async () => {
    if (!title) return;

    try {
      setLoading(true);

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
      console.log(err);
      setError(err.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  // ✅ COMPLETE TASK
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
      console.log(err);
      setError('Failed to update task');
    }
  };

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${TASK_API}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      getTasks();

    } catch (err) {
      console.log(err);
      setError('Failed to delete task');
    }
  };

  // AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

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

          {isSignup ? (
            <button onClick={signup}>Sign Up</button>
          ) : (
            <button onClick={login}>Login</button>
          )}

          <p
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
          >
            {isSignup
              ? 'Already have an account? Login'
              : "Don't have an account? Sign up"}
          </p>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {isLoggedIn && (
        <>
          <button onClick={logout}>Logout</button>

          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
            />
            <button onClick={addTask}>Add</button>
          </div>

          <div>
            <button onClick={() => setFilter('all')}>All</button>
            <button onClick={() => setFilter('pending')}>Pending</button>
            <button onClick={() => setFilter('completed')}>Completed</button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {filteredTasks.map(task => (
            <div key={task._id}>
              <span>{task.title}</span>
              <button onClick={() => markComplete(task._id)}>✔</button>
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;