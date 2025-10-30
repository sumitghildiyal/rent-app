import React, { useEffect, useState } from "react";

// Automatically picks backend URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://rent-app-uoah.onrender.com";

function App() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    tenant_name: "",
    house_name: "",
    rent_amount: "",
    date: "",
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
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/records/${editingId}`
      : `${API_BASE}/records`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error saving record");
      await fetchRecords();
      setFormData({
        tenant_name: "",
        house_name: "",
        rent_amount: "",
        date: "",
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
    <div className="container">
      <h1>🏠 Rent Record Dashboard</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="tenant_name"
          placeholder="Tenant Name"
          value={formData.tenant_name}
          onChange={handleChange}
          required
        />
        <input
          name="house_name"
          placeholder="House Name"
          value={formData.house_name}
          onChange={handleChange}
          required
        />
        <input
          name="rent_amount"
          placeholder="Rent Amount"
          type="number"
          value={formData.rent_amount}
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
              <th>Tenant</th>
              <th>House</th>
              <th>Rent</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.tenant_name}</td>
                <td>{r.house_name}</td>
                <td>₹{r.rent_amount}</td>
                <td>{r.date}</td>
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
