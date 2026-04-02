import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../customHooks/useTheme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { FaMicrochip } from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // 🔁 metric toggle: stock | issued | remaining
  const [metric, setMetric] = useState("stock");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔥 BAR GRAPH DATA (DEVICE vs PRODUCT COUNT)
  const barData = useMemo(() => {
    let data = [];

    categories.forEach((cat) => {
      cat.components.forEach((comp) => {
        const stock = comp.total || 0;
        const issued = comp.inUse || 0;
        const remaining = Math.max(stock - issued, 0);

        data.push({
          name: comp.name,
          count:
            metric === "stock"
              ? stock
              : metric === "issued"
              ? issued
              : remaining,
          componentId: comp.id,
          categoryId: cat._id || cat.id,
        });
      });
    });

    return data;
  }, [categories, metric]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`backdrop-blur px-3 py-2 rounded-lg shadow-xl ring-1 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900/90 text-white ring-white/10"
            : "bg-white/90 text-slate-900 ring-slate-300/20"
        }`}>
          <p className={`text-xs uppercase tracking-wide ${
            theme === "dark" ? "text-slate-300" : "text-slate-500"
          }`}>
            Device
          </p>
          <p className="text-sm font-semibold">{label}</p>
          <p className={`mt-1 text-xs uppercase tracking-wide ${
            theme === "dark" ? "text-slate-300" : "text-slate-500"
          }`}>
            {metric}
          </p>
          <p className="text-sm font-semibold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-[100%] h-[100%] p-6 overflow-y-scroll hide-scrollbar transition-colors duration-300 ${
      theme === "dark"
        ? "bg-gradient-to-b from-slate-900/30 to-slate-950/30"
        : "bg-gradient-to-b from-slate-50/50 to-slate-100/50"
    }`}>
      <div className={`w-[100%] h-[20%] rounded-2xl px-8 py-5 capitalize shadow-lg transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-r from-blue-400 to-cyan-400"
      }`}>
        <h1 className={`text-[34px] font-semibold drop-shadow-sm transition-colors duration-300 ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>
          welcome to mindbotics {currentUser?.username}
        </h1>
        <p className={`transition-colors duration-300 ${
          theme === "dark" ? "text-white/80" : "text-slate-800/90"
        }`}>
          Powering the Next Generation of Robotics Innovators.
        </p>
      </div>

      {/* Scroll Panel */}
      <div className="w-full pt-6 pb-4 flex gap-4 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.id}
            className={`min-w-[260px] h-[120px] rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 shrink-0 border-l-4 ${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-900"
            }`}
            style={{ borderLeftColor: cat.color }}
          >
            <h1 className={`font-semibold text-lg capitalize ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}>
              {cat.name}
            </h1>

            <p className={`text-2xl font-bold transition-colors duration-300 ${
              theme === "dark" ? "text-cyan-400" : "text-blue-600"
            }`}>
              {cat.components.length} Products
            </p>
          </div>
        ))}
      </div>

      <div className="w-[100%] h-[53%] flex justify-between gap-4">
        <div className={`w-[58%] h-full rounded-2xl p-4 shadow-lg ring-1 transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-800/50 ring-slate-700/50"
            : "bg-white/80 ring-slate-200/50"
        }`}>
          {/* 📊 BAR GRAPH */}
          <h2 className={`font-semibold mb-2 text-lg transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-slate-800"
          }`}>
            Devices vs Products Count
          </h2>

          {/* 🔁 TOGGLE */}
          <div className="flex gap-2 mb-2">
            {["stock", "issued", "remaining"].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-all font-medium ${
                  metric === m
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : theme === "dark"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height="85%" minWidth={300} minHeight={200}>
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                tick={{ fill: theme === "dark" ? "#cbd5e1" : "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme === "dark" ? "#cbd5e1" : "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: theme === "dark" ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)" }}
              />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                activeBar={{ fillOpacity: 0.9 }}
              >
                <LabelList dataKey="count" position="top" fill={theme === "dark" ? "#e2e8f0" : "#334155"} />
                {barData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      [
                        "#6366f1",
                        "#22c55e",
                        "#f97316",
                        "#ef4444",
                        "#06b6d4",
                        "#a855f7",
                      ][index % 6]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ BUTTON SECTION (ICONS + ROUTES FIXED) */}
        <div className={`w-[40%] h-full rounded-2xl shadow-lg ring-1 p-6 flex flex-col justify-center gap-6 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-800 to-slate-900 ring-slate-700/50"
            : "bg-gradient-to-br from-blue-400 to-cyan-400 ring-white/20"
        }`}>
          <h2 className={`text-xl font-semibold tracking-wide transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}>
            Quick Actions
          </h2>

          <button
            onClick={() =>
              navigate(`/userdashboard/devicedata/${categories[0]?.id}`)
            }
            disabled={!categories.length}
            className={`w-full py-4 rounded-xl font-semibold shadow hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "dark"
                ? "bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 border border-cyan-500/50"
                : "bg-white/90 text-slate-800 hover:bg-white"
            }`}
          >
            <FaMicrochip className="text-lg" />
            Manage Devices
          </button>

          <button
            onClick={() =>
              navigate(`/userdashboard/issuedevice/${categories[0]?.id}`)
            }
            disabled={!categories.length}
            className={`w-full py-4 rounded-xl font-semibold shadow hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "dark"
                ? "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border border-purple-500/50"
                : "bg-slate-900/90 text-white hover:bg-slate-800"
            }`}
          >
            <MdAssignmentTurnedIn className="text-lg" />
            Issue Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;