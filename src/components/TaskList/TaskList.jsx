import React from 'react';
import AcceptedTask from './AcceptTask';
import NewTask from './NewTask';
import CompletedTask from './CompleteTask';
import FailedTask from './FailedTask';

const TaskList = ({ data, onStatusChange }) => {
    if (!data?.tasks) {
      return <p className='text-gray-400'>No tasks found or still loading...</p>;
    }
  
    return (
      <div
        id='tasklist'
        className='h-[55%] overflow-x-auto flex items-center justify-start w-full gap-5 flex-nowrap py-5 mt-10'
      >
        {data.tasks.map((elem, idx) => {
         if (elem.active) {
  return <AcceptedTask key={idx} data={elem} onStatusChange={onStatusChange} />;
}

          if (elem.new_task) {
            return <NewTask key={idx} data={elem} onStatusChange={onStatusChange} />;
          }
          if (elem.completed) {
            return <CompletedTask key={idx} data={elem} />;
          }
          if (elem.failed) {
            return <FailedTask key={idx} data={elem} />;
          }
          return null;
        })}
      </div>
    );
  };
  
  export default TaskList;