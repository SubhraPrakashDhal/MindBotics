import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { FaPlus, FaEdit, FaMicrochip, FaTimes, FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DevicesPage = () => {
  const navigate = useNavigate();
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
    const res = await axios.get("http://localhost:3000/categories");
    const userCategories = res.data.filter(
      (cat) => String(cat.userId) === String(user?.id)
    );
    setCategories(userCategories);
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
      userId: user.id,
      components: [],
    };

    await axios.post("http://localhost:3000/categories", newCat);
    resetForm();
    fetchCategories();
  };

  const handleUpdate = async () => {
    if (!selectedCat) return alert("Select a card first!");

    await axios.patch(`http://localhost:3000/categories/${selectedCat.id}`, {
      name: newCategory,
      notes,
      color,
    });

    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:3000/categories/${id}`);
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
    setSelectedCat(selectedCat?.id === cat.id ? null : cat);
  };

  return (
    <div className="p-6 text-white" onClick={() => setSelectedCat(null)}>

      {/* 🔥 TOP BAR */}
      <div
        className="flex justify-between items-center mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search device category..."
          className="px-5 py-3 w-[320px] rounded-full bg-white/10 backdrop-blur-md border border-white/10 outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <div className="flex gap-4">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-full
            bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
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
            className="flex items-center gap-2 px-5 py-3 rounded-full
            bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
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
            key={cat.id}
            onClick={() => handleSelect(cat)}
            style={{ borderColor: cat.color }}
            className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 shadow-xl
              ${
                selectedCat?.id === cat.id
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-black scale-105"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105"
              }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(cat.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white"
              title="Delete Category"
            >
              <FaTrash size={14} />
            </button>

            <div className="flex items-center gap-3 mb-3 text-2xl">
              <FaMicrochip />
              <h2 className="text-xl font-bold">{cat.name}</h2>
            </div>

            <p className="text-sm opacity-80">
              {cat.notes || "No details"}
            </p>

            <p className="text-xs mt-2 opacity-70">
              Components: {cat.components.length}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/userdashboard/category/${cat.id}`);
              }}
              className={`mt-4 flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold ${
                selectedCat?.id === cat.id ? "bg-black text-white" : "bg-cyan-500 text-black"
              }`}
            >
              Open <FaExternalLinkAlt size={12} />
            </button>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center col-span-3 text-gray-400 mt-10">
            No matching categories found.
          </div>
        )}
      </div>

      {/* 🔥 MODAL SAME AS BEFORE */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#0F172A] p-8 rounded-2xl w-[420px] shadow-2xl border border-white/10">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">
                {selectedCat ? "Update Category" : "Create Category"}
              </h2>
              <button onClick={resetForm}>
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name..."
                className="px-4 py-3 rounded bg-white/10"
              />

              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                className="px-4 py-3 rounded bg-white/10"
              />

              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10"
              />

              {selectedCat ? (
                <button
                  onClick={handleUpdate}
                  className="py-3 bg-yellow-500 rounded"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="py-3 bg-green-500 rounded"
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
