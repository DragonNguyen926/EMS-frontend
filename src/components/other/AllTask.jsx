import React, { useEffect, useState } from 'react';
import { API } from '../../lib/api';

const AllTask = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const me = JSON.parse(sessionStorage.getItem('loggedInUser'))?.data;
        const gid = Number(me?.group_id);

        // Build query safely (avoid NaN/undefined in URL)
        const qs = new URLSearchParams({ role: 'employee' });
        if (Number.isInteger(gid) && gid > 0) {
          qs.append('group_id', String(gid));
        } else {
          // No valid group_id (old session / not logged in) -> show nothing
          setEmployees([]);
          setLoading(false);
          return;
        }

        const resUsers = await fetch(`${API}/users?${qs.toString()}`);
        if (!resUsers.ok) {
          console.error('Users fetch failed:', resUsers.status);
          setEmployees([]);
          setLoading(false);
          return;
        }

        const users = await resUsers.json();

        const usersWithTaskCounts = await Promise.all(
          users.map(async (user) => {
            const resTasks = await fetch(`${API}/tasks/${user.id}`);
            const tasks = resTasks.ok ? await resTasks.json() : [];

            const taskCounts = {
              newTask: tasks.filter((t) => t.new_task).length,
              active: tasks.filter((t) => t.active).length,
              completed: tasks.filter((t) => t.completed).length,
              failed: tasks.filter((t) => t.failed).length,
            };

            return { ...user, taskCounts };
          })
        );

        setEmployees(usersWithTaskCounts);
      } catch (err) {
        console.error('Error fetching tasks for all employees:', err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  return (
    <div className="p-6 mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] text-white font-sans">
      <div className="overflow-x-auto w-full">
        {/* Header Row */}
        <div className="mb-2 py-3 px-4 flex min-w-[600px] justify-between rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-600/20 border border-white/10">
          <h2 className="text-base font-semibold min-w-[120px] tracking-wide">Employee Name</h2>
          <h3 className="text-base font-semibold min-w-[100px] tracking-wide">New Task</h3>
          <h5 className="text-base font-semibold min-w-[100px] tracking-wide">Active Task</h5>
          <h5 className="text-base font-semibold min-w-[100px] tracking-wide">Completed</h5>
          <h5 className="text-base font-semibold min-w-[100px] tracking-wide">Failed</h5>
        </div>

        {/* Loading / Empty states */}
        {loading && (
          <div className="py-4 text-sm text-gray-300">Loading…</div>
        )}
        {!loading && employees.length === 0 && (
          <div className="py-4 text-sm text-gray-300">No employees found for your group.</div>
        )}

        {/* Employee Rows */}
        {employees.map((emp, idx) => (
          <div
            key={idx}
            className="mb-2 py-3 px-4 flex min-w-[600px] justify-between rounded-lg border border-white/10 bg-[#0b1020]/50 backdrop-blur hover:bg-[#0b1020]/70 transition"
          >
            <h2 className="text-base font-medium min-w-[120px]">{emp.first_name}</h2>
            <h3 className="text-base font-semibold min-w-[100px] text-blue-400">{emp.taskCounts.newTask}</h3>
            <h5 className="text-base font-semibold min-w-[100px] text-yellow-400">{emp.taskCounts.active}</h5>
            <h5 className="text-base font-semibold min-w-[100px] text-emerald-400">{emp.taskCounts.completed}</h5>
            <h5 className="text-base font-semibold min-w-[100px] text-red-500">{emp.taskCounts.failed}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTask;
