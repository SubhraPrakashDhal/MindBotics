import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const DeviceIssuePage = () => {
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
      const res = await axios.get("http://localhost:3000/categories");

      const userCats = res.data.filter(
        (cat) => String(cat.userId) === String(user?.id)
      );

      const allRows = [];

      userCats.forEach((cat) => {
        cat.components.forEach((comp) => {
          comp.logs.forEach((log, logIndex) => {
            allRows.push({
              categoryId: cat.id,
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
      `http://localhost:3000/categories/${row.categoryId}`
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
      `http://localhost:3000/categories/${row.categoryId}`,
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
      `http://localhost:3000/categories/${row.categoryId}`
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
      `http://localhost:3000/categories/${row.categoryId}`,
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
    const res = await axios.get(
      `http://localhost:3000/categories/${editRow.categoryId}`
    );
    const category = res.data;

    const compIndex = category.components.findIndex(
      (c) => String(c.id) === String(editRow.componentId)
    );

    const prevQty = Number(
      category.components[compIndex].logs[editRow.logIndex].quantity || 0
    );
    const nextQty = Number(form.quantity || 0);

    category.components[compIndex].inUse = Math.max(
      0,
      (category.components[compIndex].inUse || 0) + (nextQty - prevQty)
    );

    category.components[compIndex].logs[editRow.logIndex] = form;

    await axios.patch(
      `http://localhost:3000/categories/${editRow.categoryId}`,
      { components: category.components }
    );

    setShowModal(false);
    setEditRow(null);
    fetchAllIssues();
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
          `http://localhost:3000/categories/${categoryId}`
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
          `http://localhost:3000/categories/${categoryId}`,
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
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Taken Devices (All Issues)</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search by person..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 outline-none"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 outline-none"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-4 py-2 rounded bg-white/10 outline-none"
        />
      </div>

      {/* Totals + Remove All */}
      {Object.keys(totalsByPerson).length > 0 && (
        <div className="mb-4 text-sm opacity-90 flex items-center flex-wrap gap-2">
          <span className="font-semibold mr-2">Totals:</span>
          {Object.entries(totalsByPerson).map(([p, q]) => (
            <span key={p} className="mr-3">
              {p}: {q}
            </span>
          ))}

          <button
            onClick={handleRemoveAll}
            disabled={filteredRows.length === 0}
            className={`ml-auto px-3 py-1 rounded text-sm ${
              filteredRows.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Remove All
          </button>
        </div>
      )}

      {loading ? (
        <p className="opacity-70">Loading issue logs...</p>
      ) : filteredRows.length === 0 ? (
        <p className="opacity-70">No issued devices found.</p>
      ) : (
        <div className="relative border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-[#020617] block">
              <tr className="grid grid-cols-6">
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Component</th>
                <th className="p-3 text-left">Person</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="block max-h-[70vh] overflow-y-auto">
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="grid grid-cols-6 border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-3 capitalize">{row.categoryName}</td>
                  <td className="p-3 capitalize">{row.componentName}</td>
                  <td className="p-3 capitalize">{row.person}</td>
                  <td className="p-3">{row.quantity}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openUpdate(row)}
                      className="px-3 py-1 bg-yellow-400 text-black rounded text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleRemove(row)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
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
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0F172A] p-6 rounded-xl w-[360px] border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Update Issue</h2>
            <div className="flex flex-col gap-3">
              <input
                className="px-3 py-2 rounded bg-white/10"
                value={form.person}
                onChange={(e) =>
                  setForm({ ...form, person: e.target.value })
                }
              />
              <input
                type="number"
                className="px-3 py-2 rounded bg-white/10"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value),
                  })
                }
              />
              <input
                type="date"
                className="px-3 py-2 rounded bg-white/10"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2 bg-green-500 rounded text-black"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-gray-600 rounded"
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
        <div className="fixed bottom-6 right-6 bg-[#020617] border border-white/10 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span>Issue removed</span>
          <button onClick={undoRemove} className="text-cyan-400 font-semibold">
            Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default DeviceIssuePage;