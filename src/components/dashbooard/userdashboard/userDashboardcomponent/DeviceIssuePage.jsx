import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../../../customHooks/useTheme";

const DeviceIssuePage = () => {
  const { theme } = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [searchParams] = useSearchParams();
  const filterCategoryId = searchParams.get("categoryId");
  const filterComponentId = searchParams.get("componentId");

  // update modal
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ person: "", quantity: 1, date: "" });

  // undo remove
  const [undoStack, setUndoStack] = useState(null); // { row, timeoutId }

  const user = JSON.parse(localStorage.getItem("mindbrain_user"));

  const fetchAllIssues = async () => {
    try {
      const res = await axios.get("/api/categories");

      const allRows = [];

      res.data.forEach((cat) => {
        cat.components.forEach((comp) => {
          comp.logs.forEach((log, logIndex) => {
            allRows.push({
              categoryId: cat._id || cat.id,
              categoryName: cat.name,
              componentId: comp.id,
              componentName: comp.name,
              logIndex,
              person: log.person,
              quantity: log.quantity,
              date: log.date,
            });
          });
        });
      });

      setRows(allRows);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  // 🔍 filters
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const personOk = r.person.toLowerCase().includes(search.toLowerCase());
      const fromOk = fromDate ? new Date(r.date) >= new Date(fromDate) : true;
      const toOk = toDate ? new Date(r.date) <= new Date(toDate) : true;
      return personOk && fromOk && toOk;
    });
  }, [rows, search, fromDate, toDate]);

  // 📊 totals per person
  const totalsByPerson = useMemo(() => {
    const map = {};
    filteredRows.forEach((r) => {
      map[r.person] = (map[r.person] || 0) + Number(r.quantity || 0);
    });
    return map;
  }, [filteredRows]);

  // ❌ remove with undo + update inUse
  const handleRemove = async (row) => {
    const ok = window.confirm("Remove this issue record?");
    if (!ok) return;

    const res = await axios.get(
      `/api/categories/${row.categoryId}`
    );
    const category = res.data;

    const compIndex = category.components.findIndex(
      (c) => String(c.id) === String(row.componentId)
    );

    category.components[compIndex].logs.splice(row.logIndex, 1);

    category.components[compIndex].inUse = Math.max(
      0,
      (category.components[compIndex].inUse || 0) -
        Number(row.quantity || 0)
    );

    await axios.patch(
      `/api/categories/${row.categoryId}`,
      { components: category.components }
    );

    setRows((prev) => prev.filter((r) => r !== row));

    const timeoutId = setTimeout(() => setUndoStack(null), 5000);
    setUndoStack({ row: { ...row }, timeoutId });
  };

  // ⏪ undo
  const undoRemove = async () => {
    if (!undoStack) return;
    clearTimeout(undoStack.timeoutId);

    const row = undoStack.row;
    const res = await axios.get(
      `/api/categories/${row.categoryId}`
    );
    const category = res.data;

    const compIndex = category.components.findIndex(
      (c) => String(c.id) === String(row.componentId)
    );

    category.components[compIndex].logs.splice(row.logIndex, 0, {
      person: row.person,
      quantity: row.quantity,
      date: row.date,
    });

    category.components[compIndex].inUse =
      (category.components[compIndex].inUse || 0) +
      Number(row.quantity || 0);

    await axios.patch(
      `/api/categories/${row.categoryId}`,
      { components: category.components }
    );

    setUndoStack(null);
    fetchAllIssues();
  };

  // ✏️ update
  const openUpdate = (row) => {
    setEditRow(row);
    setForm({ person: row.person, quantity: row.quantity, date: row.date });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Validate quantity
      const quantity = Number(form.quantity);
      if (isNaN(quantity) || quantity < 0) {
        alert("Please enter a valid quantity (positive number)");
        return;
      }

      const res = await axios.get(
        `/api/categories/${editRow.categoryId}`
      );
      const category = res.data;

      const compIndex = category.components.findIndex(
        (c) => String(c.id) === String(editRow.componentId)
      );

      if (compIndex === -1) {
        alert("Component not found");
        return;
      }

      const component = category.components[compIndex];
      const prevQty = Number(
        component.logs[editRow.logIndex].quantity || 0
      );
      const nextQty = quantity;

      // Calculate new inUse
      const currentInUse = Number(component.inUse || 0);
      const newInUse = Math.max(0, currentInUse + (nextQty - prevQty));

      // Get total stock
      const total = Number(component.total || 0);
      const newAvailable = total - newInUse;

      // Check if new inUse exceeds total
      if (newInUse > total) {
        alert(
          `Cannot update: would exceed total stock. Total: ${total}, New In-Use would be: ${newInUse}`
        );
        return;
      }

      if (newAvailable < 0) {
        alert(`Not enough available stock. Available after update: ${newAvailable}`);
        return;
      }

      // Update the component
      component.inUse = newInUse;
      component.logs[editRow.logIndex] = {
        person: form.person || "Unknown",
        quantity: nextQty,
        date: form.date || new Date().toISOString().slice(0, 10)
      };

      await axios.patch(
        `/api/categories/${editRow.categoryId}`,
        { components: category.components }
      );

      setShowModal(false);
      setEditRow(null);
      fetchAllIssues();
      alert(
        `Issue updated successfully!\n\nComponent: ${component.name}\nTotal: ${total}\nIn-Use: ${newInUse}\nAvailable: ${newAvailable}`
      );
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update issue: " + (err.response?.data?.message || err.message));
    }
  };

  // ❌❌ REMOVE ALL (NEW FEATURE)
  const handleRemoveAll = async () => {
    if (filteredRows.length === 0) return;

    const ok = window.confirm(
      `Remove all ${filteredRows.length} issue records?`
    );
    if (!ok) return;

    try {
      const byCategory = {};

      filteredRows.forEach((row) => {
        if (!byCategory[row.categoryId]) byCategory[row.categoryId] = [];
        byCategory[row.categoryId].push(row);
      });

      for (const categoryId of Object.keys(byCategory)) {
        const res = await axios.get(
          `/api/categories/${categoryId}`
        );
        const category = res.data;

        // safer: delete from last index first
        byCategory[categoryId]
          .sort((a, b) => b.logIndex - a.logIndex)
          .forEach((row) => {
            const compIndex = category.components.findIndex(
              (c) => String(c.id) === String(row.componentId)
            );

            category.components[compIndex].logs.splice(row.logIndex, 1);
            category.components[compIndex].inUse = Math.max(
              0,
              (category.components[compIndex].inUse || 0) -
                Number(row.quantity || 0)
            );
          });

        await axios.patch(
          `/api/categories/${categoryId}`,
          { components: category.components }
        );
      }

      fetchAllIssues();
    } catch (err) {
      console.log("Remove all failed:", err);
      alert("Failed to remove all issues");
    }
  };

  return (
    <div className={`p-6 transition-all duration-300 ${
      theme === "dark"
        ? "text-white"
        : "text-slate-900"
    }`}>
      <h1 className={`text-2xl font-bold mb-4 transition-all duration-300 ${
        theme === "dark"
          ? "text-white"
          : "text-slate-900"
      }`}>Taken Devices (All Issues)</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search by person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-4 py-2 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-white/10 placeholder-white/50 text-white focus:ring-cyan-400"
              : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400"
          }`}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className={`px-4 py-2 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-white/10 text-white focus:ring-cyan-400"
              : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400"
          }`}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className={`px-4 py-2 rounded border-2 outline-none focus:ring-2 transition-all duration-300 ${
            theme === "dark"
              ? "bg-white/10 border-white/10 text-white focus:ring-cyan-400"
              : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400"
          }`}
        />
      </div>

      {/* Totals + Remove All */}
      {Object.keys(totalsByPerson).length > 0 && (
        <div className={`mb-4 text-sm opacity-90 flex items-center flex-wrap gap-2 transition-all duration-300 ${
          theme === "dark" ? "" : ""
        }`}>
          <span className="font-semibold mr-2">Totals:</span>
          {Object.entries(totalsByPerson).map(([p, q]) => (
            <span key={p} className="mr-3">
              {p}: {q}
            </span>
          ))}

          <button
            onClick={handleRemoveAll}
            disabled={filteredRows.length === 0}
            className={`ml-auto px-4 py-2 rounded text-sm font-semibold transition-all duration-300 border-2 hover:scale-105 ${
              filteredRows.length === 0
                ? theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-slate-400 border-slate-400 text-slate-600 cursor-not-allowed"
                : theme === "dark"
                ? "bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white hover:shadow-red-500/50 hover:shadow-lg"
                : "bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white hover:shadow-red-400/50 hover:shadow-lg"
            }`}
          >
            Remove All
          </button>
        </div>
      )}

      {loading ? (
        <p className={`opacity-70 transition-all duration-300 ${
          theme === "dark" ? "text-white/70" : "text-slate-600"
        }`}>Loading issue logs...</p>
      ) : filteredRows.length === 0 ? (
        <p className={`opacity-70 transition-all duration-300 ${
          theme === "dark" ? "text-white/70" : "text-slate-600"
        }`}>No issued devices found.</p>
      ) : (
        <div className={`relative border-2 rounded-xl overflow-hidden transition-all duration-300 ${
          theme === "dark"
            ? "border-white/10 bg-white/5"
            : "border-slate-300/50 bg-slate-100/30"
        }`}>
          <table className="w-full table-fixed">
            <thead className={`block transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-950/50 border-b border-white/10"
                : "bg-slate-200/50 border-b border-slate-300/50"
            }`}>
              <tr className="grid grid-cols-6">
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Category</th>
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Component</th>
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Person</th>
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Qty</th>
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Date</th>
                <th className={`p-3 text-left font-semibold transition-all duration-300 ${
                  theme === "dark" ? "text-cyan-300" : "text-blue-700"
                }`}>Actions</th>
              </tr>
            </thead>

            <tbody className={`block max-h-[70vh] overflow-y-auto transition-all duration-300 ${
              theme === "dark" ? "" : ""
            }`}>
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`grid grid-cols-6 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-t border-white/10 hover:bg-white/8"
                      : "border-t border-slate-300/30 hover:bg-slate-300/20"
                  }`}
                >
                  <td className={`p-3 capitalize transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{row.categoryName}</td>
                  <td className={`p-3 capitalize transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{row.componentName}</td>
                  <td className={`p-3 capitalize transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{row.person}</td>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{row.quantity}</td>
                  <td className={`p-3 transition-all duration-300 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}>{row.date}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openUpdate(row)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all duration-300 border-2 hover:scale-105 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-yellow-400 hover:shadow-yellow-500/50"
                          : "bg-gradient-to-r from-amber-400 to-orange-400 text-black border-amber-300 hover:shadow-amber-400/50"
                      } hover:shadow-lg`}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleRemove(row)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all duration-300 border-2 hover:scale-105 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 hover:shadow-red-500/50"
                          : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 hover:shadow-red-400/50"
                      } hover:shadow-lg`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {showModal && editRow && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`p-6 rounded-xl w-[400px] border-2 shadow-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/50 text-white"
              : "bg-gradient-to-br from-white to-slate-50 border-slate-300/50 text-slate-900"
          }`}>
            <h2 className="text-lg font-semibold mb-4">Update Issue</h2>
            
            {/* Component Details */}
            <div className={`p-3 rounded mb-4 text-sm transition-all duration-300 ${
              theme === "dark"
                ? "bg-white/10 border border-white/10"
                : "bg-slate-200/50 border border-slate-300/50"
            }`}>
              <p className="font-semibold mb-2">{editRow.componentName}</p>
              <p className="text-xs opacity-70 mb-2">Category: {editRow.categoryName}</p>
              <p className="text-xs opacity-70">Current Issue Qty: {editRow.quantity}</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className={`text-xs opacity-70 transition-all duration-300 ${
                  theme === "dark" ? "" : ""
                }`}>Person Name</label>
                <input
                  className={`px-3 py-2 rounded w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                      : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                  placeholder="Person name"
                  value={form.person}
                  onChange={(e) =>
                    setForm({ ...form, person: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={`text-xs opacity-70 transition-all duration-300 ${
                  theme === "dark" ? "" : ""
                }`}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  className={`px-3 py-2 rounded w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/10 border-slate-600 placeholder-white/50 text-white focus:ring-cyan-400 focus:border-cyan-400"
                      : "bg-slate-200/40 border-slate-300 placeholder-slate-600 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className={`text-xs opacity-70 transition-all duration-300 ${
                  theme === "dark" ? "" : ""
                }`}>Date</label>
                <input
                  type="date"
                  className={`px-3 py-2 rounded w-full border-2 outline-none focus:ring-2 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-white/10 border-slate-600 text-white focus:ring-cyan-400 focus:border-cyan-400"
                      : "bg-slate-200/40 border-slate-300 text-slate-900 focus:ring-blue-400 focus:border-blue-400"
                  }`}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdate}
                  className={`flex-1 py-2 rounded font-semibold transition-all duration-300 border-2 hover:scale-105 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500 hover:shadow-green-500/50"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 hover:shadow-emerald-400/50"
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-2 rounded font-semibold transition-all duration-300 border-2 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
                      : "bg-slate-400/50 border-slate-400 hover:bg-slate-500 text-white"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Undo Snackbar */}
      {undoStack && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 border-2 ${
          theme === "dark"
            ? "bg-slate-950/80 border-white/10 text-white"
            : "bg-slate-100/80 border-slate-300/50 text-slate-900"
        }`}>
          <span>Issue removed</span>
          <button onClick={undoRemove} className={`font-semibold transition-all duration-300 ${
            theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
          }`}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceIssuePage;