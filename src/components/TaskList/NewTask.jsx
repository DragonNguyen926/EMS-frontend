import React from 'react';
import { API } from '../../lib/api'; 

const NewTask = ({ data, onStatusChange }) => {
    const handleAccept = async () => {
      try {
        await fetch(`${API}/tasks/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            new_task: false,
            active: true,
            completed: false,
            failed: false,
          }),
        });
  
        onStatusChange(); // 🔁 trigger refresh
      } catch (err) {
        console.error('Error accepting task:', err);
      }
    };
  
    const handleDecline = async () => {
      try {
        await fetch(`${API}/tasks/${data.id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            new_task: false,
            active: false,
            completed: false,
            failed: true,
          }),
        });
  
        onStatusChange(); // 🔁 trigger refresh
      } catch (err) {
        console.error('Error declining task:', err);
      }
    };
  
    return (
      <div className='flex-shrink-0 h-full w-full sm:w-[300px]
p-5 bg-red-400 rounded-xl'>
        <div className='flex justify-between items-center'>
          <h3 className='bg-red-600 text-sm px-3 py-1 rounded'>{data.category}</h3>
          <h4 className='text-sm'>{new Date(data.task_date).toLocaleDateString()}</h4>
        </div>
        <h2 className='mt-5 text-2xl font-semibold'>{data.title}</h2>
        <p className='text-sm mt-2'>{data.description}</p>
        <div className='mt-6 flex gap-2'>
          <button
            onClick={handleAccept}
            className='bg-blue-500 rounded font-medium py-1 px-2 text-xs text-white'
          >
            Accept Task
          </button>
          <button
            onClick={handleDecline}
            className='bg-red-600 rounded font-medium py-1 px-2 text-xs text-white'
          >
            Decline
          </button>
        </div>
      </div>
    );
  };
  
  export default NewTask;
  