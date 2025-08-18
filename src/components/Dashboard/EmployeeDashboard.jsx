import React, { useEffect, useState } from 'react';
import Header from '../other/Header';
import TaskListNum from '../other/TaskListNum';
import TaskList from '../TaskList/TaskList';
import { API } from '../../lib/api';

const EmployeeDashboard = ({ changeUser, data }) => {
  const [userData, setUserData] = useState(data);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 🧠 trigger refresh

  const refreshTasks = () => setRefreshTrigger(prev => !prev); // toggle to re-fetch

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API}/tasks/${data.id}`);
        const tasks = await res.json();

        const taskCounts = {
          newTask: tasks.filter(t => t.new_task).length,
          completed: tasks.filter(t => t.completed).length,
          active: tasks.filter(t => t.active).length,
          failed: tasks.filter(t => t.failed).length,
        };

        setUserData({
          ...data,
          tasks,
          taskCounts
        });
      } catch (err) {
        console.error('Error fetching employee tasks:', err);
      }
    };

    fetchTasks();
  }, [data.id, refreshTrigger]);

  return (
    <div
      className="p-10 h-screen relative"
      style={{
        backgroundColor: '#0b1020',
        backgroundImage: `
          radial-gradient(40rem 40rem at -10% -10%, rgba(16,185,129,0.18), rgba(16,185,129,0) 60%),
          radial-gradient(48rem 48rem at 110% 120%, rgba(37,99,235,0.18), rgba(37,99,235,0) 60%)
        `,
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <Header changeUser={changeUser} data={userData} />
      <div className= "flex justify-right">
        <h2
          className="
            text-3xl font-extrabold tracking-widest uppercase
            bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 
            bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(0,255,200,0.4)]
            select-none
          "
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          MEMBER DASHBOARD
        </h2></div>
      <TaskListNum data={userData} />
      <TaskList data={userData} onStatusChange={refreshTasks} />
    </div>
  );
};

export default EmployeeDashboard;
