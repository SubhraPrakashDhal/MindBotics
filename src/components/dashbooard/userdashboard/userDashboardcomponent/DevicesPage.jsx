import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { FaPlus, FaEdit, FaMicrochip, FaTimes, FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../customHooks/useTheme";

const DevicesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [showModal, setShowModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  // 🔥 SEARCH STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("mindbrain_user"));

  const fetchCategories = async () => {
    const res = await axios.get("/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, []);

  // 🔥 DEBOUNCE LOGIC (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🔥 FUSE INSTANCE
  const fuse = useMemo(() => {
    return new Fuse(categories, {
      keys: ["name", "notes"],
      threshold: 0.4, // lower = stricter
    });
  }, [categories]);

  // 🔥 FILTERED DATA (FUZZY + DEBOUNCED)
  const filteredCategories = useMemo(() => {
    if (!debouncedSearch) return categories;

    const results = fuse.search(debouncedSearch);
    return results.map((result) => result.item);
  }, [debouncedSearch, categories, fuse]);

  const handleAdd = async () => {
    if (!newCategory || !user?.id) return;

    const newCat = {
      name: newCategory,
      notes,
      color,
      components: [],
    };

    await axios.post("/api/categories", newCat);
    resetForm();
    fetchCategories();
  };

  const handleUpdate = async () => {
    if (!selectedCat) return alert("Select a card first!");

    try {
      await axios.patch(`/api/categories/${selectedCat._id || selectedCat.id}`, {
        name: newCategory,
        notes,
        color,
      });

      resetForm();
      fetchCategories();
      alert("Category updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update category: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
      setSelectedCat(null);
    } catch (err) {
      console.log(err);
      alert("Failed to delete category");
    }
  };

  const resetForm = () => {
    setNewCategory("");
    setNotes("");
    setColor("#38bdf8");
    setSelectedCat(null);
    setShowModal(false);
  };

  const handleSelect = (cat) => {
    setSelectedCat((selectedCat?._id || selectedCat?.id) === (cat._id || cat.id) ? null : cat);
  };

  return (
    <div className={`p-6 transition-all duration-300 ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }`} onClick={() => setSelectedCat(null)}>

      {/* 🔥 TOP BAR */}
      <div
        className="flex justify-between items-center mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search device category..."
          className={`px-5 py-3 w-[320px] rounded-full backdrop-blur-md border outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-white/10 text-white placeholder-white/50 focus:ring-cyan-400"
              : "bg-slate-200/40 border-slate-300/50 text-slate-900 placeholder-slate-600 focus:ring-blue-400"
          }`}
        />

        <div className="flex gap-4">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-black font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-300"
                : "bg-gradient-to-r from-blue-500 to-cyan-400 border-blue-400"
            }`}
          >
            <FaPlus /> Add Card
          </button>

          <button
            onClick={() => {
              if (!selectedCat) {
                alert("Select a card first!");
                return;
              }

              setNewCategory(selectedCat.name);
              setNotes(selectedCat.notes || "");
              setColor(selectedCat.color || "#38bdf8");
              setShowModal(true);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-black font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300"
                : "bg-gradient-to-r from-amber-400 to-orange-500 border-amber-300"
            }`}
          >
            <FaEdit /> Update
          </button>
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div
        className="grid grid-cols-3 gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {filteredCategories.map((cat) => (
          <div
            key={cat._id || cat.id}
            onClick={() => handleSelect(cat)}
            style={{ borderColor: cat.color }}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 shadow-xl ${
              (selectedCat?._id || selectedCat?.id) === (cat._id || cat.id)
                ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-black scale-105 shadow-2xl"
                : theme === "dark"
                ? "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-105"
                : "bg-slate-200/40 border-slate-300/40 hover:bg-slate-200/60 hover:border-slate-400/40 hover:scale-105 text-slate-900"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(cat._id || cat.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === "dark"
                  ? "bg-red-500/80 hover:bg-red-600 text-white"
                  : "bg-red-500/80 hover:bg-red-600 text-white"
              }`}
              title="Delete Category"
            >
              <FaTrash size={14} />
            </button>

            <div className="flex items-center gap-3 mb-3 text-2xl">
              <FaMicrochip />
              <h2 className="text-xl font-bold">{cat.name}</h2>
            </div>

            <p className={`text-sm opacity-80 ${
              (selectedCat?._id || selectedCat?.id) === (cat._id || cat.id) ? "text-black" : ""
            }`}>
              {cat.notes || "No details"}
            </p>

            <p className={`text-xs mt-2 opacity-70 ${
              (selectedCat?._id || selectedCat?.id) === (cat._id || cat.id) ? "text-black" : ""
            }`}>
              Components: {cat.components.length}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const id = cat._id || cat.id;
                if (!id) {
                  alert("Category ID not found");
                  return;
                }
                navigate(`/userdashboard/category/${id}`);
              }}
              className={`mt-4 flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold transition-all duration-300 border hover:shadow-lg ${
                (selectedCat?._id || selectedCat?.id) === (cat._id || cat.id)
                  ? "bg-black text-white border-black"
                  : theme === "dark"
                  ? "bg-cyan-500/80 text-black border-cyan-400 hover:bg-cyan-600"
                  : "bg-blue-500/80 text-white border-blue-400 hover:bg-blue-600"
              }`}
            >
              Open <FaExternalLinkAlt size={12} />
            </button>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className={`text-center col-span-3 mt-10 ${
            theme === "dark" ? "text-gray-400" : "text-slate-500"
          }`}>
            No matching categories found.
          </div>
        )}
      </div>

      {/* 🔥 MODAL SAME AS BEFORE */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className={`p-8 rounded-2xl w-[420px] shadow-2xl border-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 text-white"
              : "bg-gradient-to-br from-white to-slate-50 border-slate-300/50 text-slate-900"
          }`}>
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">
                {selectedCat ? "Update Category" : "Create Category"}
              </h2>
              <button onClick={resetForm} className="hover:scale-110 transition-all duration-300">
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name..."
                className={`px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                    : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />

              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                className={`px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                    : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
                }`}
              />

              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-2 border-slate-400"
              />

              {selectedCat ? (
                <button
                  onClick={handleUpdate}
                  className={`py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-yellow-400 hover:shadow-yellow-500/50"
                      : "bg-gradient-to-r from-amber-400 to-orange-400 text-black border-amber-400 hover:shadow-amber-400/50"
                  }`}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className={`py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 hover:shadow-green-500/50"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 hover:shadow-emerald-500/50"
                  }`}
                >
                  Create Category
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;
