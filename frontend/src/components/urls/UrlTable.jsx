import React from "react";

import {
  Copy,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";

import { motion } from "framer-motion";

const UrlTable = ({ urls }) => {

  const copyUrl = (shortCode) => {
    navigator.clipboard.writeText(
      `http://localhost:8000/goto/${shortCode}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden"
    >
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        
        <div>
          <h2 className="text-2xl font-bold text-white">
            Your Links
          </h2>

          <p className="text-slate-400 mt-1">
            Manage all shortened URLs
          </p>
        </div>

        <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:scale-105 transition">
          + Create Link
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        
        <table className="w-full">
          
          <thead className="bg-white/5">
            <tr>
              
              <th className="text-left p-5 text-slate-400 font-medium">
                Original URL
              </th>

              <th className="text-left p-5 text-slate-400 font-medium">
                Short URL
              </th>

              <th className="text-left p-5 text-slate-400 font-medium">
                Created
              </th>

              <th className="text-left p-5 text-slate-400 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            
            {urls.map((url) => (
              <tr
                key={url._id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                
                {/* ORIGINAL URL */}
                <td className="p-5">
                  <div className="max-w-[350px] truncate text-white">
                    {url.originalUrl}
                  </div>
                </td>

                {/* SHORT URL */}
                <td className="p-5">
                  
                  <a
                    href={`http://localhost:8000/goto/${url.shortCode}`}
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                  >
                    {url.shortCode}

                    <ExternalLink size={16} />
                  </a>

                </td>

                {/* DATE */}
                <td className="p-5 text-slate-300">
                  {new Date(
                    url.createdAt
                  ).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="p-5">
                  
                  <div className="flex items-center gap-3">
                    
                    <button
                      onClick={() => copyUrl(url.shortCode)}
                      className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition"
                    >
                      <Copy size={18} />
                    </button>

                    <button className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition">
                      <Pencil size={18} />
                    </button>

                    <button className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </motion.div>
  );
};

export default UrlTable;