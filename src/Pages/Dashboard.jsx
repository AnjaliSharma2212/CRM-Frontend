import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate= useNavigate()
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/dashboard");
        setStats(res.data.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!stats) return <p className="text-center mt-20 text-red-600">Failed to load dashboard</p>;

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard Analytics</h1>
<button
  onClick={() => navigate("/leads")}
  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
>
  View Leads →
</button>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-gray-500 text-sm">Total Leads</h2>
          <p className="text-3xl font-bold">{stats.totals.leads}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totals.users}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-gray-500 text-sm">Total Activities</h2>
          <p className="text-3xl font-bold">{stats.totals.activities}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Line Chart */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Leads Created Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.charts.leadsByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Leads by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.charts.leadStatus}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="_count.status" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 shadow rounded-xl col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Activities by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.charts.activitiesByType}
                dataKey="_count.type"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {stats.charts.activitiesByType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
