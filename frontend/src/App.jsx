import { useEffect, useState } from "react";

function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    floor_no: "",
    amount: "",
    date: "",
    mode: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/records")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://127.0.0.1:8000/records/${editingId}`
      : "http://127.0.0.1:8000/records";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (editingId) {
      setRecords(records.map((r) => (r.id === editingId ? data : r)));
      setEditingId(null);
    } else {
      setRecords([...records, data]);
    }

    setForm({ floor_no: "", amount: "", date: "", mode: "", description: "" });
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/records/${id}`, { method: "DELETE" });
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditingId(record.id);
  };

  // ✅ Group by floor_no (not floor)
  const grouped = records.reduce((acc, rec) => {
    if (!acc[rec.floor_no]) acc[rec.floor_no] = [];
    acc[rec.floor_no].push(rec);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "30px" }}>
      <h1 style={{ textAlign: "center" }}>🏠 Rent Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "10px",
          maxWidth: "400px",
          margin: "20px auto",
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3>{editingId ? "✏️ Edit Record" : "➕ Add Record"}</h3>
        <input
          placeholder="Floor No."
          value={form.floor_no}
          onChange={(e) => setForm({ ...form, floor_no: e.target.value })}
          required
        />
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          placeholder="Mode"
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Record" : "Add Record"}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.keys(grouped).map((floor) => (
          <div
            key={floor}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "15px",
              width: "280px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "5px" }}>
              Floor {floor}
            </h3>
            {grouped[floor].map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "8px",
                  background: "#fafafa",
                }}
              >
                <div><b>₹{r.amount}</b> — {r.mode}</div>
                <div style={{ fontSize: "0.9em", color: "#555" }}>{r.date}</div>
                <div style={{ fontSize: "0.85em", marginBottom: "5px" }}>
                  {r.description}
                </div>
                <button
                  onClick={() => handleEdit(r)}
                  style={{
                    background: "#ffc107",
                    color: "#333",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    marginRight: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
