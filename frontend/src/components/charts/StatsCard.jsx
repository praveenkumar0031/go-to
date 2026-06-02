import React from "react";

import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
    >
      
      <div className="flex items-center justify-between mb-5">
        
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
          {icon}
        </div>

        <span className="text-emerald-400 text-sm">
          +12%
        </span>
      </div>

      <p className="text-slate-400 mb-2">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-white">
        {value}
      </h2>

    </motion.div>
  );
};

export default StatsCard;