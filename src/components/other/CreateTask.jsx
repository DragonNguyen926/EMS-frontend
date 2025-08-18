import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { API } from '../../lib/api';

const CreateTask = () => {
  const [userData, setUserData] = useContext(AuthContext);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [asignTo, setAsignTo] = useState('');
  const [category, setCategory] = useState('');

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const me = JSON.parse(sessionStorage.getItem('loggedInUser'))?.data;
        const gid = Number(me?.group_id);
        const qs = new URLSearchParams({ role: 'employee' });
        if (Number.isInteger(gid) && gid > 0) qs.append('group_id', String(gid));
        const res = await fetch(`${API}/users?${qs.toString()}`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to load employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const admin = JSON.parse(sessionStorage.getItem('loggedInUser'))?.data;
    
  if (!admin) {
    alert('Missing admin (not logged in). Please log in again.');
    return;
  }
  if (!asignTo) {
    alert('Please select an employee to assign.');
    return;
  }

    const task = {
      title: taskTitle,
      description: taskDescription,
      task_date: taskDate,
      category: category,
      active: false,
      new_task: true,
      completed: false,
      failed: false,
      assigned_to: Number(asignTo),
      created_by: Number(admin.id)
    };

    try {
      const response = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task created:', result);
        window.location.reload();
      } else {
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Server error');
    }

    setTaskTitle('');
    setCategory('');
    setAsignTo('');
    setTaskDate('');
    setTaskDescription('');
  };

  return (
    <div className="p-6 mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] text-white font-sans">
      <form
        onSubmit={submitHandler}
        className="flex flex-wrap w-full items-start justify-between gap-4"
      >
        {/* Left column */}
        <div className="w-full md:w-1/2">
          <div>
            <h3 className="text-sm text-gray-300 mb-1">Task Title</h3>
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              type="text"
              placeholder="Make a UI design"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 mb-1">Date</h3>
            <input
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              type="date"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 mb-1">Assign to</h3>
            <select
              value={asignTo}
              onChange={(e) => setAsignTo(e.target.value)}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#0b1020] text-white">
                  {emp.first_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 mb-1">Category</h3>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm py-2 px-3 w-4/5 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              type="text"
              placeholder="design, dev, etc"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-2/5 flex flex-col items-start">
          <h3 className="text-sm text-gray-300 mb-1">Description</h3>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full h-44 text-sm py-2 px-4 rounded-lg outline-none bg-[#0b1020]/50 border border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
          ></textarea>
          <button className="mt-4 w-full py-3 px-5 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 transition shadow-lg shadow-emerald-500/20">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
