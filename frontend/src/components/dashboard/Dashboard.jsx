import React, { useEffect, useState } from "react";

import DashboardLayout from "./DashboardLayout";
import StatsCard from "../charts/StatsCard";
import TrafficChart from "../charts/TrafficChart";
import UrlTable from "../urls/UrlTable";
import RecentActivity from "../actions/RecentActivity";

import {
  getUserApi,
  getAllUrls,
  getTodayLogs,
} from "../../api/api";

import {
  Link2,
  MousePointerClick,
  Activity,
  Globe,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [todayLogs, setTodayLogs] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const userData = await getUserApi();
      const urlsData = await getAllUrls();
      const logsData = await getTodayLogs();

      setUser(userData);
      setUrls(urlsData.urls || []);
      setTodayLogs(logsData);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalClicks =
    todayLogs?.todayClicks || 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#07111f] text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      
      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Welcome back,
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {" "}
            {user?.username}
          </span>
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor links, traffic, and analytics.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        
        <StatsCard
          title="Total Links"
          value={urls.length}
          icon={<Link2 />}
        />

        <StatsCard
          title="Today's Clicks"
          value={totalClicks}
          icon={<MousePointerClick />}
        />

        <StatsCard
          title="Traffic Status"
          value="Active"
          icon={<Activity />}
        />

        <StatsCard
          title="Reach"
          value="Global"
          icon={<Globe />}
        />
      </div>

      {/* CHART + ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        <div className="xl:col-span-2">
          <TrafficChart
            data={todayLogs?.hourlyTraffic || []}
          />
        </div>

        <RecentActivity
          logs={todayLogs?.recentLogs || []}
        />
      </div>

      {/* URL TABLE */}
      <UrlTable urls={urls} />
    </DashboardLayout>
  );
};

export default Dashboard;