import React, { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://rent-app-uoah.onrender.com";

function App() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    floor_no: "",
    amount: "",
    date: "",
    mode: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch records on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/records`);
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // ensure proper data types
  const cleanData = {
    floor_no: Number(formData.floor_no),
    amount: Number(formData.amount),
    date: formData.date,
    mode: formData.mode.trim(),
    description: formData.description.trim() || null,
  };

  const method = editingId ? "PUT" : "POST";
  const url = editingId
    ? `${API_BASE}/records/${editingId}`
    : `${API_BASE}/records`;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Backend Error:", err);
      throw new Error("Error saving record");
    }

    await fetchRecords();
    setFormData({
      floor_no: "",
      amount: "",
      date: "",
      mode: "",
      description: "",
    });
    setEditingId(null);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await fetch(`${API_BASE}/records/${id}`, { method: "DELETE" });
      await fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "700px", margin: "auto" }}>
      <h1>🏠 Rent Record Dashboard</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="floor_no"
          placeholder="Floor No"
          type="number"
          value={formData.floor_no}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          placeholder="Amount (₹)"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          placeholder="Date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          name="mode"
          placeholder="Mode (e.g. Cash, UPI)"
          value={formData.mode}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update" : "Add Record"}
        </button>
      </form>

      <h2>📋 Records</h2>
      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Floor</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.floor_no}</td>
                <td>₹{r.amount}</td>
                <td>{r.date}</td>
                <td>{r.mode}</td>
                <td>{r.description}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Edit</button>
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
