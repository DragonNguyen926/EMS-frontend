import React from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'

const AdminDashBoard = ({ changeUser, data }) => {
  const adminId = data?.id;

  return (
    <div
      className="h-screen w-full p-10 text-white"
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
      <Header changeUser={changeUser} data={data} />
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
          LEADER DASHBOARD
        </h2></div>
      {/* pass adminId to children so they can send x-user-id */}
      <CreateTask adminId={adminId} />
      <AllTask adminId={adminId} />
    </div>
  );
};

export default AdminDashBoard;
