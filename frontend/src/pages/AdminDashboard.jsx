import React, { useEffect, useState } from "react";
import "../Dashboard.css";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // 🔹 Demo volunteers (temporary)
  const volunteers = [
    { id: 1, name: "Rahul" },
    { id: 2, name: "Anita" },
    { id: 3, name: "Vikram" }
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(stored);
  }, []);

  const assignVolunteer = (id, volunteerName) => {
    const updated = complaints.map((c) =>
      c.id === id
        ? { ...c, assignedTo: volunteerName, status: "Assigned" }
        : c
    );

    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  const markResolved = (id) => {
    const updated = complaints.map((c) =>
      c.id === id
        ? { ...c, status: "Resolved" }
        : c
    );

    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  const total = complaints.length;
  const assigned = complaints.filter(c => c.status === "Assigned").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = total - assigned - resolved;

  return (
    <div className="admin-layout">
      <div className="admin-topbar">
        <h2>CleanStreet Admin</h2>
      </div>

      <div className="admin-body">

        {/* Sidebar */}
        <div className="admin-sidebar">
          <h3>Admin Panel</h3>
          <ul>
            <li
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </li>

            <li
              className={activeTab === "complaints" ? "active" : ""}
              onClick={() => setActiveTab("complaints")}
            >
              Manage Complaints
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="admin-content">

          {activeTab === "overview" && (
            <>
              <h2>System Overview</h2>

              <div className="admin-cards">
                <div className="admin-card">
                  <h3>{total}</h3>
                  <p>Total Complaints</p>
                </div>

                <div className="admin-card">
                  <h3>{pending}</h3>
                  <p>Pending</p>
                </div>

                <div className="admin-card">
                  <h3>{assigned}</h3>
                  <p>Assigned</p>
                </div>

                <div className="admin-card">
                  <h3>{resolved}</h3>
                  <p>Resolved</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "complaints" && (
            <>
              <h2>Manage Complaints</h2>

              {complaints.length === 0 ? (
                <p>No complaints submitted yet.</p>
              ) : (
                complaints.map((c) => (
                  <div key={c.id} className="complaint-box">
                    <h4>{c.title}</h4>
                    <p>{c.description}</p>
                    <p>Status: {c.status}</p>
                    <p>
                      Assigned To: {c.assignedTo || "Not Assigned"}
                    </p>

                    {/* Volunteer Dropdown */}
                    <select
                      onChange={(e) =>
                        assignVolunteer(c.id, e.target.value)
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Volunteer
                      </option>

                      {volunteers.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        assignVolunteer(
                          c.id,
                          document.querySelector("select").value
                        )
                      }
                    >
                      Assign
                    </button>

                    {c.status !== "Resolved" && (
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => markResolved(c.id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;