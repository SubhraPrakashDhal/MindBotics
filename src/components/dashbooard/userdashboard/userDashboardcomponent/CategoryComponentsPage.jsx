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

const CategoryComponentsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
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
      const res = await axios.get(
        `http://localhost:3000/categories/${categoryId}`
      );
      setCategory(res.data);
    } catch (err) {
      console.log("Fetch category failed:", err.message);
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

    const updated = [...(category.components || [])];

    const newComponent = {
      ...form,
      price: Number(form.price) || 0,
      total: Number(form.total) || 0,
      inUse: Number(form.inUse) || 0,
      logs: editIndex !== null ? updated[editIndex]?.logs || [] : [],
    };

    if (editIndex !== null) updated[editIndex] = newComponent;
    else updated.push(newComponent);

    try {
      await axios.patch(
        `http://localhost:3000/categories/${categoryId}`,
        { components: updated }
      );

      setCategory({ ...category, components: updated });
      setForm({ id: "", name: "", price: "", total: "", inUse: "" });
      setEditIndex(null);
      setShowModal(false);
    } catch (err) {
      console.log("Save component failed:", err.message);
    }
  };

  // DELETE
  const deleteComponent = async (i) => {
    if (!category) return;

    const updated = [...category.components];
    updated.splice(i, 1);

    try {
      await axios.patch(
        `http://localhost:3000/categories/${categoryId}`,
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
    updated[i].total += 1;
    await updateDB(updated);
  };

  const decTotal = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    if (updated[i].total > updated[i].inUse) updated[i].total -= 1;
    await updateDB(updated);
  };

  // IN USE CONTROL
  const incUse = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    if (updated[i].inUse < updated[i].total) updated[i].inUse += 1;
    await updateDB(updated);
  };

  const decUse = async (i) => {
    if (!category) return;
    const updated = [...category.components];
    if (updated[i].inUse > 0) updated[i].inUse -= 1;
    await updateDB(updated);
  };

  const updateDB = async (updated) => {
    try {
      await axios.patch(
        `http://localhost:3000/categories/${categoryId}`,
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
    const available = comp.total - comp.inUse;

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
  const available = comp.total - comp.inUse;

  if (qty > available) {
    return alert(`Only ${available} items are available in stock.`);
  }

  // ✅ total ko touch mat karo
  comp.inUse += qty;

  if (!comp.logs) comp.logs = [];

  comp.logs.push({
    person: issueForm.person || "Unknown",
    quantity: qty,
    date: issueForm.date,
  });

  await updateDB(updated);
  setShowIssueModal(false);
};
  // ⭐ OPEN LOGS MODAL
  const openLogsModal = (i) => {
    setLogsComponentIndex(i);
    setShowLogsModal(true);
    setLogSearch("");
    setLogFrom("");
    setLogTo("");
  };

  if (!category) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{category.name} Components</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-full
          bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold
          hover:scale-105 transition shadow-lg"
        >
          <FaPlus /> Add Component
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-center border border-white/10">
        <thead className="bg-white/10">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Total</th>
            <th>In Use</th>
            <th>Available</th>
            <th>Value</th>
            <th>Actions</th>
            <th>Issue</th>
          </tr>
        </thead>

        <tbody>
          {(category.components || []).map((c, i) => {
            const available = c.total - c.inUse;
            const value = c.total * c.price;

            return (
              <tr key={i} className="border-t border-white/10">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>₹{c.price}</td>

                <td>
                  <button
                    onClick={() => decTotal(i)}
                    className="px-2 py-1 bg-cyan-600 rounded text-xs"
                  >
                    −
                  </button>
                  <span className="mx-2">{c.total}</span>
                  <button
                    onClick={() => incTotal(i)}
                    className="px-2 py-1 bg-cyan-400 text-black rounded text-xs"
                  >
                    +
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => decUse(i)}
                    className="px-2 py-1 bg-cyan-600 rounded text-xs"
                  >
                    −
                  </button>
                  <span className="mx-2">{c.inUse}</span>
                  <button
                    onClick={() => incUse(i)}
                    className="px-2 py-1 bg-cyan-400 text-black rounded text-xs"
                  >
                    +
                  </button>
                </td>

                <td>{available}</td>
                <td>₹{value}</td>

                {/* ACTIONS */}
                <td className="flex justify-center gap-2 py-2">
                  <button
                    onClick={() => editComponent(i)}
                    className="px-2 py-1 bg-yellow-500 rounded text-xs"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteComponent(i)}
                    className="px-2 py-1 bg-red-500 rounded text-xs"
                  >
                    <FaTrash />
                  </button>
                </td>

                {/* ISSUE + SHOW ISSUES */}
                <td className="text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openIssueModal(i)}
                      className="px-3 py-1 bg-purple-500 rounded text-xs flex items-center gap-1"
                    >
                      <FaUserCheck /> Issue
                    </button>

                    <button
                      onClick={() => openLogsModal(i)}
                      className="px-3 py-1 bg-cyan-500 rounded text-xs flex items-center gap-1 text-black"
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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <Modal
          title={editIndex !== null ? "Update Component" : "Add Component"}
          onClose={() => setShowModal(false)}
          form={form}
          onChange={handleChange}
          onSave={handleSave}
        />
      )}

      {/* ISSUE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#0F172A] p-8 rounded-2xl w-[420px]">
            <h2 className="text-xl font-bold mb-4">Issue Component</h2>

            <input
              placeholder="Person Name"
              value={issueForm.person}
              onChange={(e) =>
                setIssueForm({ ...issueForm, person: e.target.value })
              }
              className="bg-white/10 p-2 rounded mb-2 w-full"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={issueForm.quantity}
              onChange={(e) =>
                setIssueForm({ ...issueForm, quantity: e.target.value })
              }
              className="bg-white/10 p-2 rounded mb-2 w-full"
            />

            <input
              type="date"
              value={issueForm.date}
              onChange={(e) =>
                setIssueForm({ ...issueForm, date: e.target.value })
              }
              className="bg-white/10 p-2 rounded mb-4 w-full"
            />

            <button
              onClick={saveIssueDetails}
              className="bg-purple-500 p-2 rounded w-full"
            >
              Save Issue
            </button>

            <button
              onClick={() => setShowIssueModal(false)}
              className="bg-gray-500 p-2 rounded w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SHOW ISSUES MODAL */}
      {showLogsModal && logsComponentIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#0F172A] p-6 rounded-2xl w-[520px] max-h-[70vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                Issued Logs – {category.components[logsComponentIndex].name}
              </h2>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-red-400 text-sm"
              >
                Close
              </button>
            </div>

            {/* 🔍 LOG FILTERS */}
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Search person..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="bg-white/10 p-2 rounded w-full"
              />
              <input
                type="date"
                value={logFrom}
                onChange={(e) => setLogFrom(e.target.value)}
                className="bg-white/10 p-2 rounded"
              />
              <input
                type="date"
                value={logTo}
                onChange={(e) => setLogTo(e.target.value)}
                className="bg-white/10 p-2 rounded"
              />
            </div>

            {(!category.components[logsComponentIndex].logs ||
              category.components[logsComponentIndex].logs.length === 0) ? (
              <p className="opacity-70 text-sm">
                No issues recorded for this component.
              </p>
            ) : (
              <table className="w-full text-sm border border-white/10">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-left">Person</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Date</th>
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
                      <tr key={idx} className="border-t border-white/10">
                        <td className="p-2 capitalize">{log.person}</td>
                        <td className="p-2">{log.quantity}</td>
                        <td className="p-2">{log.date}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// SMALL MODAL COMPONENT
const Modal = ({ title, onClose, form, onChange, onSave }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-[#0F172A] p-8 rounded-2xl w-[420px]">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <input
          name="id"
          placeholder="ID"
          value={form.id}
          onChange={onChange}
          className="bg-white/10 p-2 rounded"
        />

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          className="bg-white/10 p-2 rounded"
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
          className="bg-white/10 p-2 rounded"
        />

        <input
          name="total"
          placeholder="Stock"
          value={form.total}
          onChange={onChange}
          className="bg-white/10 p-2 rounded"
        />

        <input
          name="inUse"
          placeholder="In Use"
          value={form.inUse}
          onChange={onChange}
          className="bg-white/10 p-2 rounded"
        />

        <button onClick={onSave} className="bg-green-500 p-2 rounded mt-2">
          Save
        </button>
      </div>
    </div>
  </div>
);

export default CategoryComponentsPage;