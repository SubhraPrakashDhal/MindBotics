import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import { FaUser, FaLock, FaPalette, FaSave, FaSignOutAlt, FaTrash, FaCamera } from "react-icons/fa";

const Settings = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog className="text-cyan-400" /> Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-cyan-400" />
            <h3 className="text-lg font-semibold">Profile</h3>
          </div>

          <div className="flex items-center gap-5 mb-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/40">
              <img
                src={preview || "https://i.pravatar.cc/150"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              <FaCamera /> Change Photo
              <input type="file" accept="image/*" hidden onChange={handleImage} />
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <FaLock className="text-pink-400" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <FaPalette className="text-violet-400" />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Dark Mode</p>
            <button className="w-12 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className=" flex flex-wrap gap-4 justify-end">
        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition-all">
          <FaSave /> Save Changes
        </button>

        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
          <FaSignOutAlt /> Logout
        </button>

        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
          <FaTrash /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;