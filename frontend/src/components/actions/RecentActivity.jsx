import React from "react";

import {
  MousePointerClick,
} from "lucide-react";

import { motion } from "framer-motion";

const RecentActivity = ({ logs }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-full"
    >
      
      {/* HEADER */}
      <div className="mb-8">
        
        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="text-slate-400 mt-1">
          Latest visitor interactions
        </p>
      </div>

      {/* ACTIVITY LIST */}
      <div className="space-y-5">
        
        {logs.length === 0 ? (
          <div className="text-slate-400 text-center py-10">
            No recent activity
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              
              {/* ICON */}
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white shrink-0">
                <MousePointerClick size={20} />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                
                <div className="flex items-center justify-between">
                  
                  <h4 className="text-white font-medium">
                    New Link Visit
                  </h4>

                  <span className="text-xs text-slate-500">
                    {new Date(
                      log.createdAt
                    ).toLocaleTimeString()}
                  </span>

                </div>

                <p className="text-slate-400 text-sm mt-1 break-all">
                  {log.ipAddress}
                </p>

                <div className="mt-2 text-xs text-cyan-400 truncate">
                  {log.userAgent}
                </div>

              </div>

            </div>
          ))
        )}

      </div>
    </motion.div>
  );
};

export default RecentActivity;