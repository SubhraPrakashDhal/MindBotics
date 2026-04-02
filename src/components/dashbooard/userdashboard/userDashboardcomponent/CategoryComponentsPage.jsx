import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaListUl,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../customHooks/useTheme";

const CategoryComponentsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // ⭐ ISSUE MODAL STATES
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueIndex, setIssueIndex] = useState(null);

  // ⭐ SHOW ISSUES TAB
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logsComponentIndex, setLogsComponentIndex] = useState(null);

  // 🔍 LOG FILTER STATES (ADDED)
  const [logSearch, setLogSearch] = useState("");
  const [logFrom, setLogFrom] = useState("");
  const [logTo, setLogTo] = useState("");

  const [issueForm, setIssueForm] = useState({
    person: "",
    quantity: 1,
    date: "",
  });

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    total: "",
    inUse: "",
  });

  // FETCH CATEGORY
  const fetchCategory = async () => {
    try {
      setError(null);
      const res = await axios.get(
        `/api/categories/${categoryId}`
      );
      setCategory(res.data);
    } catch (err) {
      console.log("Fetch category failed:", err.message);
      setError(err.message || "Failed to load category");
      setCategory(null);
    }
  };

  useEffect(() => {
    if (!categoryId) return;
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD / UPDATE COMPONENT
  const handleSave = async () => {
    if (!category) return;

    // Validation
    if (!form.name.trim()) {
      alert("Component name is required");
      return;
    }

    const price = Number(form.price);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price (positive number)");
      return;
    }

    const total = Number(form.total);
    if (isNaN(total) || total < 0) {
      alert("Please enter a valid total quantity (positive number)");
      return;
    }

    const inUse = Number(form.inUse);
    if (isNaN(inUse) || inUse < 0) {
      alert("Please enter a valid in-use quantity (positive number or 0)");
      return;
    }

    if (inUse > total) {
      alert("In-use quantity cannot exceed total quantity");
      return;
    }

    const updated = [...(category.components || [])];

    const newComponent = {
      ...form,
      price: price,
      total: total,
      inUse: inUse,
      logs: editIndex !== null ? updated[editIndex]?.logs || [] : [],
    };

    if (editIndex !== null) updated[editIndex] = newComponent;
    else updated.push(newComponent);

    try {
      await axios.patch(
        `/api/categories/${categoryId}`,
        { components: updated }
      );

      setCategory({ ...category, components: updated });
      setForm({ id: "", name: "", price: "", total: "", inUse: "" });
      setEditIndex(null);
      setShowModal(false);
      alert(editIndex !== null ? "Component updated successfully!" : "Component added successfully!");
    } catch (err) {
      console.log("Save component failed:", err.message);
      alert("Failed to save component: " + (err.response?.data?.message || err.message));
    }
  };

  // DELETE
  const deleteComponent = async (i) => {
    if (!category) return;

    const updated = [...category.components];
    updated.splice(i, 1);

    try {
      await axios.patch(
        `/api/categories/${categoryId}`,
        { components: updated }
      );
      setCategory({ ...category, components: updated });
    } catch (err) {
      console.log("Delete failed:", err.message);
    }
  };

  // EDIT
  const editComponent = (i) => {
    const c = category.components[i];
    setForm({
      id: c.id || "",
      name: c.name || "",
      price: c.price ?? "",
      total: c.total ?? "",
      inUse: c.inUse ?? "",
    });
    setEditIndex(i);
    setShowModal(true);
  };

  // TOTAL CONTROL
  const incTotal = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    updated[i].total = Number(updated[i].total) + 1;
    await updateDB(updated);
  };

  const decTotal = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    const total = Number(updated[i].total);
    const inUse = Number(updated[i].inUse);
    if (total > inUse) updated[i].total = total - 1;
    await updateDB(updated);
  };

  // IN USE CONTROL
  const incUse = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    const total = Number(updated[i].total);
    const inUse = Number(updated[i].inUse);
    if (inUse < total) updated[i].inUse = inUse + 1;
    await updateDB(updated);
  };

  const decUse = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    const inUse = Number(updated[i].inUse);
    if (inUse > 0) updated[i].inUse = inUse - 1;
    await updateDB(updated);
  };

  const updateDB = async (updated) => {
    try {
      await axios.patch(
        `/api/categories/${categoryId}`,
        { components: updated }
      );
      setCategory({ ...category, components: updated });
    } catch (err) {
      console.log("Update DB failed:", err.message);
    }
  };

  // ⭐ OPEN ISSUE MODAL (BLOCK IF NO STOCK)
  const openIssueModal = (i) => {
    const comp = category.components[i];
    const total = Number(comp.total) || 0;
    const inUse = Number(comp.inUse) || 0;
    const available = total - inUse;

    if (available <= 0) {
      alert("This device is out of stock.");
      return;
    }

    setIssueIndex(i);
    setIssueForm({
      person: "",
      quantity: 1,
      date: new Date().toISOString().slice(0, 10),
    });
    setShowIssueModal(true);
  };

// ⭐ SAVE ISSUE DETAILS (DOUBLE CHECK)
const saveIssueDetails = async () => {
  if (!category || issueIndex === null) return;

  const updated = [...category.components];
  const comp = updated[issueIndex];

  const qty = Number(issueForm.quantity) || 0;
  const total = Number(comp.total) || 0;
  const inUse = Number(comp.inUse) || 0;
  const available = total - inUse;

  if (!issueForm.person.trim()) {
    return alert("Please enter person name");
  }

  if (qty <= 0) {
    return alert("Quantity must be greater than 0");
  }

  if (qty > available) {
    return alert(
      `Cannot issue ${qty} items. Only ${available} items are available in stock.\n\nTotal: ${total}\nIn Use: ${inUse}\nAvailable: ${available}`
    );
  }

  // ✅ total ko touch mat karo
  const newInUse = inUse + qty;
  comp.inUse = newInUse;

  if (!comp.logs) comp.logs = [];

  comp.logs.push({
    person: issueForm.person || "Unknown",
    quantity: qty,
    date: issueForm.date,
  });

  await updateDB(updated);
  setShowIssueModal(false);
  alert(
    `Issue recorded successfully!\n\n${comp.name}\nIssued: ${qty}\nNew In-Use: ${newInUse}\nNew Available: ${total - newInUse}`
  );
};
  // ⭐ OPEN LOGS MODAL
  const openLogsModal = (i) => {
    setLogsComponentIndex(i);
    setShowLogsModal(true);
    setLogSearch("");
    setLogFrom("");
    setLogTo("");
  };

  if (error) return <div className={`p-6 transition-all duration-300 ${
    theme === "dark" ? "text-red-400" : "text-red-500"
  }`}>Error: {error}</div>;
  if (!category) return <div className={`p-6 transition-all duration-300 ${
    theme === "dark" ? "text-white" : "text-slate-900"
  }`}>Loading category...</div>;

  return (
    <div className={`p-6 transition-all duration-300 ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }`}>
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold transition-all duration-300 ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}>{category.name} Components</h1>

        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-black font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-300"
              : "bg-gradient-to-r from-blue-500 to-cyan-400 border-blue-400"
          }`}
        >
          <FaPlus /> Add Component
        </button>
      </div>

      {/* TABLE */}
      <div className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
        theme === "dark"
          ? "border-white/10 bg-white/5"
          : "border-slate-300/50 bg-slate-100/30"
      }`}>
        <table className="w-full text-center">
          <thead className={`transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-950/50 border-b border-white/10"
              : "bg-slate-200/50 border-b border-slate-300/50"
          }`}>
            <tr>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>ID</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Name</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Price</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Total</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>In Use</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Available</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Value</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Actions</th>
              <th className={`p-3 font-semibold transition-all duration-300 ${
                theme === "dark" ? "text-cyan-300" : "text-blue-700"
              }`}>Issue</th>
            </tr>
          </thead>

          <tbody>
            {(category.components || []).map((c, i) => {
              const total = Number(c.total) || 0;
              const inUse = Number(c.inUse) || 0;
              const price = Number(c.price) || 0;
              const available = total - inUse;
              const value = total * price;

              return (
                <tr key={i} className={`transition-all duration-300 ${
                  theme === "dark"
                    ? "border-t border-white/10 hover:bg-white/8"
                    : "border-t border-slate-300/30 hover:bg-slate-300/20"
                }`}>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{c.id}</td>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{c.name}</td>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>₹{price}</td>

                  <td className="p-3">
                    <button
                      onClick={() => decTotal(i)}
                      className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                        theme === "dark"
                          ? "bg-cyan-600/80 border-cyan-500 hover:bg-cyan-700 text-white"
                          : "bg-blue-500/80 border-blue-400 hover:bg-blue-600 text-white"
                      }`}
                    >
                      −
                    </button>
                    <span className={`mx-2 transition-all duration-300 ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>{total}</span>
                    <button
                      onClick={() => incTotal(i)}
                      className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                        theme === "dark"
                          ? "bg-cyan-400 border-cyan-300 hover:bg-cyan-500 text-black"
                          : "bg-blue-400 border-blue-300 hover:bg-blue-500 text-white"
                      }`}
                    >
                      +
                    </button>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => decUse(i)}
                      className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                        theme === "dark"
                          ? "bg-cyan-600/80 border-cyan-500 hover:bg-cyan-700 text-white"
                          : "bg-blue-500/80 border-blue-400 hover:bg-blue-600 text-white"
                      }`}
                    >
                      −
                    </button>
                    <span className={`mx-2 transition-all duration-300 ${
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }`}>{inUse}</span>
                    <button
                      onClick={() => incUse(i)}
                      className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                        theme === "dark"
                          ? "bg-cyan-400 border-cyan-300 hover:bg-cyan-500 text-black"
                          : "bg-blue-400 border-blue-300 hover:bg-blue-500 text-white"
                      }`}
                    >
                      +
                    </button>
                  </td>

                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{available}</td>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>₹{value}</td>

                  {/* ACTIONS */}
                  <td className={`py-2 transition-all duration-300`}>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editComponent(i)}
                        className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-yellow-400 hover:shadow-yellow-500/50"
                            : "bg-gradient-to-r from-amber-400 to-orange-400 text-black border-amber-300 hover:shadow-amber-400/50"
                        } hover:shadow-lg hover:scale-105`}
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteComponent(i)}
                        className={`px-2 py-1 rounded text-xs transition-all duration-300 border ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 hover:shadow-red-500/50"
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 hover:shadow-red-400/50"
                        } hover:shadow-lg hover:scale-105`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>

                  {/* ISSUE + SHOW ISSUES */}
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openIssueModal(i)}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all duration-300 border hover:scale-105 ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 hover:shadow-purple-500/50"
                            : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-400 hover:shadow-indigo-400/50"
                        } hover:shadow-lg`}
                      >
                        <FaUserCheck /> Issue
                      </button>

                      <button
                        onClick={() => openLogsModal(i)}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all duration-300 border hover:scale-105 ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black border-cyan-400 hover:shadow-cyan-500/50"
                            : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-blue-400 hover:shadow-blue-400/50"
                        } hover:shadow-lg`}
                      >
                        <FaListUl /> Show Issues
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <Modal
          title={editIndex !== null ? "Update Component" : "Add Component"}
          onClose={() => setShowModal(false)}
          form={form}
          onChange={handleChange}
          onSave={handleSave}
          theme={theme}
        />
      )}

      {/* ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className={`p-8 rounded-2xl w-[420px] border-2 shadow-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 text-white"
              : "bg-gradient-to-br from-white to-slate-50 border-slate-300/50 text-slate-900"
          }`}>
            <h2 className="text-xl font-bold mb-4">Issue Component</h2>

            {/* STOCK INFO */}
            {issueIndex !== null && (
              <div className={`p-3 rounded mb-4 text-sm border-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/10 border-white/10"
                  : "bg-slate-200/50 border-slate-300/50"
              }`}>
                <p className="font-semibold mb-2">{category.components[issueIndex].name}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="opacity-70">Total:</span>
                    <p className={`font-bold transition-all duration-300 ${
                      theme === "dark" ? "text-cyan-400" : "text-blue-600"
                    }`}>
                      {Number(category.components[issueIndex].total) || 0}
                    </p>
                  </div>
                  <div>
                    <span className="opacity-70">In Use:</span>
                    <p className={`font-bold transition-all duration-300 ${
                      theme === "dark" ? "text-yellow-400" : "text-amber-600"
                    }`}>
                      {Number(category.components[issueIndex].inUse) || 0}
                    </p>
                  </div>
                  <div>
                    <span className="opacity-70">Available:</span>
                    <p className={`font-bold transition-all duration-300 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}>
                      {(Number(category.components[issueIndex].total) || 0) -
                        (Number(category.components[issueIndex].inUse) || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <input
              placeholder="Person Name"
              value={issueForm.person}
              onChange={(e) =>
                setIssueForm({ ...issueForm, person: e.target.value })
              }
              className={`p-3 rounded mb-2 w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                  : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={issueForm.quantity}
              onChange={(e) =>
                setIssueForm({ ...issueForm, quantity: e.target.value })
              }
              className={`p-3 rounded mb-2 w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                  : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />

            <input
              type="date"
              value={issueForm.date}
              onChange={(e) =>
                setIssueForm({ ...issueForm, date: e.target.value })
              }
              className={`p-3 rounded mb-4 w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-white/10 border-slate-600 text-white focus:ring-cyan-400 focus:border-cyan-400"
                  : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />

            <button
              onClick={saveIssueDetails}
              className={`p-3 rounded w-full font-semibold transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg mb-2 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 hover:shadow-purple-500/50"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-400 hover:shadow-indigo-400/50"
              }`}
            >
              Save Issue
            </button>

            <button
              onClick={() => setShowIssueModal(false)}
              className={`p-3 rounded w-full font-semibold transition-all duration-300 border-2 hover:scale-105 ${
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
                  : "bg-slate-400/50 border-slate-400 hover:bg-slate-500 text-white"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SHOW ISSUES MODAL */}
      {showLogsModal && logsComponentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className={`p-6 rounded-2xl w-[520px] max-h-[70vh] overflow-y-auto border-2 shadow-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 text-white"
              : "bg-gradient-to-br from-white to-slate-50 border-slate-300/50 text-slate-900"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                Issued Logs – {category.components[logsComponentIndex].name}
              </h2>
              <button
                onClick={() => setShowLogsModal(false)}
                className={`text-sm font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
                }`}
              >
                Close
              </button>
            </div>

            {/* 🔍 LOG FILTERS */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                placeholder="Search person..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className={`p-2 rounded border-2 outline-none focus:ring-2 flex-1 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400"
                    : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400"
                }`}
              />
              <input
                type="date"
                value={logFrom}
                onChange={(e) => setLogFrom(e.target.value)}
                className={`p-2 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/10 border-slate-600 text-white focus:ring-cyan-400"
                    : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400"
                }`}
              />
              <input
                type="date"
                value={logTo}
                onChange={(e) => setLogTo(e.target.value)}
                className={`p-2 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/10 border-slate-600 text-white focus:ring-cyan-400"
                    : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400"
                }`}
              />
            </div>

            {(!category.components[logsComponentIndex].logs ||
              category.components[logsComponentIndex].logs.length === 0) ? (
              <p className={`opacity-70 text-sm transition-all duration-300 ${
                theme === "dark" ? "text-white/70" : "text-slate-600"
              }`}>
                No issues recorded for this component.
              </p>
            ) : (
              <div className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                theme === "dark"
                  ? "border-white/10 bg-white/5"
                  : "border-slate-300/50 bg-slate-100/30"
              }`}>
                <table className="w-full text-sm">
                  <thead className={`transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-950/50 border-b border-white/10"
                      : "bg-slate-200/50 border-b border-slate-300/50"
                  }`}>
                    <tr>
                      <th className={`p-2 text-left font-semibold transition-all duration-300 ${
                        theme === "dark" ? "text-cyan-300" : "text-blue-700"
                      }`}>Person</th>
                      <th className={`p-2 text-left font-semibold transition-all duration-300 ${
                        theme === "dark" ? "text-cyan-300" : "text-blue-700"
                      }`}>Qty</th>
                      <th className={`p-2 text-left font-semibold transition-all duration-300 ${
                        theme === "dark" ? "text-cyan-300" : "text-blue-700"
                      }`}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.components[logsComponentIndex].logs
                      .filter((l) => {
                        const personOk = l.person
                          ?.toLowerCase()
                          .includes(logSearch.toLowerCase());
                        const fromOk = logFrom
                          ? new Date(l.date) >= new Date(logFrom)
                          : true;
                        const toOk = logTo
                          ? new Date(l.date) <= new Date(logTo)
                          : true;
                        return personOk && fromOk && toOk;
                      })
                      .map((log, idx) => (
                        <tr key={idx} className={`transition-all duration-300 ${
                          theme === "dark"
                            ? "border-t border-white/10 hover:bg-white/8"
                            : "border-t border-slate-300/30 hover:bg-slate-300/20"
                        }`}>
                          <td className={`p-2 capitalize transition-all duration-300 ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}>{log.person}</td>
                          <td className={`p-2 transition-all duration-300 ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}>{log.quantity}</td>
                          <td className={`p-2 transition-all duration-300 ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}>{log.date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// SMALL MODAL COMPONENT
const Modal = ({ title, onClose, form, onChange, onSave, theme }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
    <div className={`p-8 rounded-2xl w-[420px] border-2 shadow-2xl transition-all duration-300 ${
      theme === "dark"
        ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 text-white"
        : "bg-gradient-to-br from-white to-slate-50 border-slate-300/50 text-slate-900"
    }`}>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="hover:scale-110 transition-all duration-300">
          <FaTimes />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <input
          name="id"
          placeholder="ID"
          value={form.id}
          onChange={onChange}
          className={`p-3 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
          }`}
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          className={`p-3 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
          }`}
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
          className={`p-3 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
          }`}
        />

        <input
          name="total"
          placeholder="Stock"
          value={form.total}
          onChange={onChange}
          className={`p-3 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
          }`}
        />

        <input
          name="inUse"
          placeholder="In Use"
          value={form.inUse}
          onChange={onChange}
          className={`p-3 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
          }`}
        />

        <button onClick={onSave} className={`p-3 rounded mt-2 font-semibold transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg ${
          theme === "dark"
            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500 hover:shadow-green-500/50"
            : "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 hover:shadow-emerald-400/50"
        }`}>
          Save
        </button>
      </div>
    </div>
  </div>
);

export default CategoryComponentsPage;