import React from 'react';
import Header from '../../other/Header';
import GroupsPanel from './GroupsPanel';
import PendingPanel from './PendingPanel';
import MembersPanel from './MembersPanel';

const DevDashboard = ({ changeUser, data }) => {
  const devId = data?.id;

  return (
    <div
      className="min-h-screen w-full p-10 pb-24 text-white"
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
          DEV DASHBOARD
        </h2>
      </div>
      <GroupsPanel devId={devId} />
      <PendingPanel devId={devId} />
      <MembersPanel devId={devId} />
    </div>
  );
};

export default DevDashboard;
