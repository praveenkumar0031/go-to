import React from "react";

//import Sidebar from "../Sidebar";
import Topbar from "../actions/Topbar";

const DashboardLayout = ({
  children,
  user,
}) => {
  return (
    <div className="min-h-screen bg-[#07111f] flex">
      
      {/* //<Sidebar /> */}

      <div className="flex-1 overflow-hidden">
        
        <Topbar user={user} />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;