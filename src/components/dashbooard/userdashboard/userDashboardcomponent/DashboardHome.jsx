import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
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
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // 🔁 metric toggle: stock | issued | remaining
  const [metric, setMetric] = useState("stock");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      const userCats = res.data.filter((cat) => cat.userId === currentUser.id);
      setCategories(userCats);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchCategories();
    }
  }, [currentUser]);

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
          categoryId: cat.id,
        });
      });
    });

    return data;
  }, [categories, metric]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur bg-slate-900/90 text-white px-3 py-2 rounded-lg shadow-xl ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Device
          </p>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-300">
            {metric}
          </p>
          <p className="text-sm font-semibold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-[100%] h-[100%] p-6 bg-[#ffffff57] overflow-y-scroll hide-scrollbar">
      <div className="w-[100%] h-[20%] rounded-2xl px-8 py-5 capitalize bg-gradient-to-r from-orange-400 to-amber-400 shadow-lg">
        <h1 className="text-[34px] font-semibold text-white drop-shadow-sm">
          welcome to mindbotics {currentUser?.username}
        </h1>
        <p className="text-white/90">
          Powering the Next Generation of Robotics Innovators.
        </p>
      </div>

      {/* Scroll Panel */}
      <div className="w-full pt-6 pb-4 flex gap-4 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[260px] h-[120px] bg-white/90 backdrop-blur rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 shrink-0"
            style={{ borderLeft: `6px solid ${cat.color}` }}
          >
            <h1 className="font-semibold text-lg capitalize text-slate-800">
              {cat.name}
            </h1>

            <p className="text-2xl font-bold text-indigo-600">
              {cat.components.length} Products
            </p>
          </div>
        ))}
      </div>

      <div className="w-[100%] h-[53%] flex justify-between gap-4">
        <div className="w-[58%] h-full rounded-2xl bg-white/90 backdrop-blur p-4 shadow-lg ring-1 ring-slate-200">
          {/* 📊 BAR GRAPH */}
          <h2 className="font-semibold mb-2 text-lg text-slate-800">
            Devices vs Products Count
          </h2>

          {/* 🔁 TOGGLE */}
          <div className="flex gap-2 mb-2">
            {["stock", "issued", "remaining"].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${
                  metric === m
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
              />

              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                animationDuration={1200}
                activeBar={{ fillOpacity: 0.9 }}
              >
                <LabelList dataKey="count" position="top" fill="#334155" />
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
        <div className="w-[40%] h-full rounded-2xl bg-gradient-to-br from-lime-400 to-yellow-400 shadow-lg ring-1 ring-white/20 p-6 flex flex-col justify-center gap-6">
          <h2 className="text-white text-xl font-semibold tracking-wide">
            Quick Actions
          </h2>

          <button
            onClick={() =>
              navigate(`/userdashboard/devicedata/${categories[0]?.id}`)
            }
            disabled={!categories.length}
            className="w-full py-4 rounded-xl bg-white/90 text-slate-800 font-semibold shadow hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMicrochip className="text-lg" />
            Manage Devices
          </button>

          <button
            onClick={() =>
              navigate(`/userdashboard/issuedevice/${categories[0]?.id}`)
            }
            disabled={!categories.length}
            className="w-full py-4 rounded-xl bg-slate-900/90 text-white font-semibold shadow hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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