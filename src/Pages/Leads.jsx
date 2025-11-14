
import { useEffect, useState } from "react";
import api from "../api/axios";
import LeadForm from "../components/LeadForm";
import { jwtDecode } from "jwt-decode";
import ActivityTimeline from "./ActivityTimeline";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null); // 👈 NEW

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Fetch leads err:", err);
      alert("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const loadOwners = async () => {
    try {
      const res = await api.get("/users/all").catch(() => null);
      if (res?.data) setOwners(res.data);
      else {
        const token = localStorage.getItem("token");
        if (token) {
          const { id, name } = jwtDecode(token);
          setOwners([{ id, name }]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    loadOwners();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const onEdit = (lead) => {
    setEditing(lead);
    setOpenForm(true);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      load();
    } catch (err) {
      console.error("Delete err:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-2">
          <button onClick={onCreate} className="px-4 py-2 bg-green-600 text-white rounded">New Lead</button>
          <button onClick={load} className="px-4 py-2 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Company</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Owner</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-2">{l.name}</td>
                  <td className="p-2">{l.email}</td>
                  <td className="p-2">{l.phone}</td>
                  <td className="p-2">{l.company}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">{l.owner?.name || "—"}</td>

                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => setSelectedLead(l)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(l)}
                      className="px-2 py-1 border rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(l.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSaved={load}
        initial={editing}
        owners={owners}
      />

      {/* 👇 Only show timeline when a lead is selected */}
      {selectedLead && (
        <ActivityTimeline leadId={selectedLead.id} />
      )}

    </div>
  );
}
