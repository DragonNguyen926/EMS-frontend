import React from 'react';

const TaskListNum = ({ data }) => {
  if (!data?.taskCounts) return null;

  return (
    <div className='flex flex-nowrap overflow-x-auto gap-5 mt-10 w-full px-2'>
      <div className='rounded-xl min-w-[220px] sm:min-w-[250px] max-w-[300px] w-full py-6 px-9 bg-red-400'>
        <h2 className='text-3xl font-bold'>{data.taskCounts.newTask}</h2>
        <h3 className='text-xl mt-0.5 font-medium'>New Task</h3>
      </div>
      <div className='rounded-xl min-w-[220px] sm:min-w-[250px] max-w-[300px] w-full py-6 px-9 bg-blue-400'>
        <h2 className='text-3xl font-bold'>{data.taskCounts.completed}</h2>
        <h3 className='text-xl mt-0.5 font-medium'>Completed Task</h3>
      </div>
      <div className='rounded-xl min-w-[220px] sm:min-w-[250px] max-w-[300px] w-full py-6 px-9 bg-green-400'>
        <h2 className='text-3xl text-black font-bold'>{data.taskCounts.active}</h2>
        <h3 className='text-xl mt-0.5 font-medium'>Accepted Task</h3>
      </div>
      <div className='rounded-xl min-w-[220px] sm:min-w-[250px] max-w-[300px] w-full py-6 px-9 bg-yellow-400'>
        <h2 className='text-3xl font-semibold'>{data.taskCounts.failed}</h2>
        <h3 className='text-xl mt-0.5 font-medium'>Fail Task</h3>
      </div>
    </div>
  );
};

export default TaskListNum;
