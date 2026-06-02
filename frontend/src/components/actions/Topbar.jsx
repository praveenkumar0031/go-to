import React from "react";

import { Bell } from "lucide-react";

const Topbar = ({ user }) => {
  return (
    <header className="h-20 border-b border-slate-800 bg-[#07111f]/70 backdrop-blur-xl flex items-center justify-between px-6">
      
      <div>
        <h2 className="text-white font-semibold text-xl">
          URL Analytics Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">
        
        <button className="relative">
          <Bell className="text-slate-400" />

          <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-400 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          
          <div className="h-11 w-11 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center font-bold text-black">
            {user?.username?.charAt(0)}
          </div>

          <div>
            <p className="text-white font-medium">
              {user?.username}
            </p>

            <p className="text-slate-400 text-sm">
              {user?.email}
            </p>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Topbar;