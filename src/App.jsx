import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';
import Weather from './Weather';

// Mock user database
const users = {
  aaditya: { password: 'password' },
  user: { password: 'password' }
};

function App() {
  const [todo, setTodo] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });
  
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : {};
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (users[username] && users[username].password === password) {
      setCurrentUser(username);
      setLoginError("");
      // Initialize todos for new user if they don't exist
      if (!todos[username]) {
        setTodos(prev => ({ ...prev, [username]: [] }));
      }
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername("");
    setPassword("");
  };

  function handleEdit(e, id) {
    const userTodos = todos[currentUser];
    const todoToEdit = userTodos.find((i) => i.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.todo);
      const newTodos = userTodos.filter((item) => item.id !== id);
      setTodos({ ...todos, [currentUser]: newTodos });
    }
  }

  function handleDelete(e, id) {
    const userTodos = todos[currentUser];
    const newTodos = userTodos.filter((item) => item.id !== id);
    setTodos({ ...todos, [currentUser]: newTodos });
  }

  function handleAdd() {
    if (todo.trim()) {
      const userTodos = todos[currentUser] || [];
      setTodos({
        ...todos,
        [currentUser]: [...userTodos, { id: uuidv4(), todo, isCompleted: false }]
      });
      setTodo("");
    }
  }

  function handleChange(e) {
    setTodo(e.target.value);
  }

  function toggleComplete(id) {
    const userTodos = todos[currentUser];
    const updatedTodos = userTodos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos({ ...todos, [currentUser]: updatedTodos });
  }

  function handleToggleImportant(id) {
    const userTodos = todos[currentUser];
    const updatedTodos = userTodos.map((item) =>
      item.id === id ? { ...item, isImportant: !item.isImportant } : item
    );
    setTodos({ ...todos, [currentUser]: updatedTodos });
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const userTodos = todos[currentUser] || [];
  const pendingTodos = userTodos.filter(item => !item.isCompleted);
  const completedTodos = userTodos.filter(item => item.isCompleted);

  if (!currentUser) {
    return (
      <div className={`container py-4 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className={`card ${isDarkMode ? 'bg-dark text-light' : ''}`}>
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Login to TodoFlow</h4>
                {loginError && <div className="alert alert-danger">{loginError}</div>}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
              </div>
            </div>
            <p>This is the demo version of the app.</p>
            <p>Please enable location services for the weather API to function.</p>
            <p>Account 1: Username: aaditya, password: password</p>
            <p>Account 2: Username: user, password: password</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container py-4">
        <div className={`container py-4 ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              {/* Header with Title, Welcome Message, and Controls */}
              <div className={`d-flex justify-content-between align-items-center mb-4 ${isDarkMode ? 'text-light' : ''}`}>
                <div>
                  <h4 className="mb-0">TodoFlow</h4>
                  <h2 className="mb-0">Hello, {currentUser}!</h2>
                </div>
                <div>
                  <button 
                    className={`btn ${isDarkMode ? 'btn-dark' : 'btn-light'} me-2`}
                    onClick={toggleTheme}
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>

              <Weather isDarkMode={isDarkMode} />

          
              {/* Progress Tracker */}
              <div className={`p-3 rounded shadow-sm mb-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Today's Tasks</span>
                  <small className={isDarkMode ? 'text-light' : 'text-muted'}>ⓘ</small>
                </div>
                <h2>{userTodos.length}</h2>
                <div className="progress mt-3" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ 
                      width: `${userTodos.length ? (completedTodos.length / userTodos.length) * 100 : 0}%` 
                    }}
                    role="progressbar"
                    aria-valuenow={userTodos.length ? (completedTodos.length / userTodos.length) * 100 : 0}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small>{pendingTodos.length} Pending</small>
                  <small>{completedTodos.length} Done</small>
                </div>
              </div>

              {/* Add Task Input */}
              <div className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    value={todo}
                    onChange={handleChange}
                    placeholder="Add A Task"
                  />
                  <button
                    className="btn btn-success"
                    onClick={handleAdd}
                    disabled={todo.length <= 3}
                    
                  >
                    ADD TASK
                  </button>
                </div>
              </div>

              {/* Pending Tasks */}
              <div>
                {pendingTodos.map((item) => (
                  <div 
                    key={item.id} 
                    className={`d-flex justify-content-between align-items-center p-2 border-bottom ${
                      isDarkMode ? 'border-secondary text-light' : ''
                    }`}
                  >
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={item.isCompleted}
                        onChange={() => toggleComplete(item.id)}
                      />
                      <label className="form-check-label">{item.todo}</label>
                    </div>
                    <div>
                      <button 
                        className="btn btn-link text-warning p-0 me-2"
                        onClick={() => handleToggleImportant(item.id)}
                      >
                        {item.isImportant ? '★' : '☆'}
                      </button>
                      <button 
                        className="btn btn-link text-primary p-0 me-2"
                        onClick={(e) => handleEdit(e, item.id)}
                      >
                        ✎
                      </button>
                      <button 
                        className="btn btn-link text-danger p-0"
                        onClick={(e) => handleDelete(e, item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Completed Tasks */}
              {completedTodos.length > 0 && (
                <div className="mt-4">
                  <h6 className={`mb-3 ${isDarkMode ? 'text-light' : ''}`}>Completed</h6>
                  {completedTodos.map((item) => (
                    <div 
                      key={item.id} 
                      className={`d-flex justify-content-between align-items-center p-2 border-bottom ${
                        isDarkMode ? 'border-secondary text-light' : 'text-muted'
                      }`}
                    >
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={item.isCompleted}
                          onChange={() => toggleComplete(item.id)}
                        />
                        <label className={`form-check-label text-decoration-line-through ${
                          isDarkMode ? 'text-light' : ''
                        }`}>
                          {item.todo}
                        </label>
                      </div>
                      <div>
                        <button 
                          className="btn btn-link text-warning p-0 me-2"
                          onClick={() => handleToggleImportant(item.id)}
                        >
                          {item.isImportant ? '★' : '☆'}
                        </button>
                        <button 
                          className="btn btn-link text-danger p-0"
                          onClick={(e) => handleDelete(e, item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
