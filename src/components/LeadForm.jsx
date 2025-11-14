
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function LeadForm({ open, onClose, onSaved, initial = null, owners = [] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "NEW",
    ownerId: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        email: initial.email || "",
        phone: initial.phone || "",
        company: initial.company || "",
        status: initial.status || "NEW",
        ownerId: initial.ownerId || "",
      });
    } else {
      setForm((f) => ({ ...f, ownerId: owners?.[0]?.id || "" }));
    }
  }, [initial, owners]);

  if (!open) return null;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (initial) {
        await api.put(`/leads/${initial.id}`, form);
      } else {
        await api.post("/leads", form);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Lead save error:", err.response || err);
      alert(err.response?.data?.message || "Failed to save lead");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{initial ? "Edit Lead" : "Create Lead"}</h3>
        <form onSubmit={submit} className="space-y-3">
          <input name="name" value={form.name} onChange={handle} placeholder="Name" className="w-full border p-2 rounded" required />
          <input name="email" value={form.email} onChange={handle} placeholder="Email" className="w-full border p-2 rounded" />
          <input name="phone" value={form.phone} onChange={handle} placeholder="Phone" className="w-full border p-2 rounded" />
          <input name="company" value={form.company} onChange={handle} placeholder="Company" className="w-full border p-2 rounded" />
          <select name="status" value={form.status} onChange={handle} className="w-full border p-2 rounded">
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>

          <select name="ownerId" value={form.ownerId} onChange={handle} className="w-full border p-2 rounded">
            <option value="">Assign to (optional)</option>
            {owners?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{initial ? "Save" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
