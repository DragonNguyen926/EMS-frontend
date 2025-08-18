import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashBoard from './components/Dashboard/AdminDashBoard';
import { AuthContext } from './context/AuthProvider';
import Register from './components/Auth/Register';
import DevDashboard from './components/Dashboard/Dev/DevDashboard';
import { API } from './lib/api';

localStorage.clear()
const App = () => {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData, setUserData] = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser)
      setUser(userData.role)
      setLoggedInUserData(userData.data)
    }
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API}/login`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 403 && data?.message === 'waiting for leader') {
        alert('Your account is waiting for leader approval. Please try again later.');
        return;
      }

      if (response.status === 401 || !data) {
        alert('Invalid Credential');
        return;
      }

      const taskRes = await fetch(`${API}/tasks/${data.id}`);
      const tasks = await taskRes.json();

      const taskCounts = {
        newTask: tasks.filter(t => t.new_task).length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => t.active).length,
        failed: tasks.filter(t => t.failed).length,
      };

      const userData = { ...data, tasks, taskCounts };

      setUser(userData.role);
      setLoggedInUserData(userData);

      sessionStorage.setItem('loggedInUser', JSON.stringify({
           role: data.role,
           data: {
             id: data.id,
             first_name: data.first_name,
             role: data.role,
             status: data.status,
             group_id: data.group_id, // ⬅️ add this
           }
         }));
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error during login');
    }
  };

  return (
    <>
      {!user && !showRegister && (
        <Login handleLogin={handleLogin} onSwitch={() => setShowRegister(true)} />
      )}
      {!user && showRegister && (
        <Register onSwitch={() => setShowRegister(false)} />
      )}

      {}
      {user === 'dev' ? (
        <DevDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'admin' || user === 'leader' ? (
        <AdminDashBoard changeUser={setUser} data={loggedInUserData} />
      ) : user === 'employee' ? (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      ) : null}
    </>
  );
}

export default App
