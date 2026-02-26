import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(stored);
  }, []);

  return (
    <div className="admin-layout">
      <div className="admin-topbar">
        <h2>CleanStreet User</h2>
      </div>

      <div className="admin-body">
        <div className="admin-content">

          <h2>Your Complaints</h2>

          <Link
            to="/submit"
            style={{
              display: "inline-block",
              marginBottom: "20px",
              color: "#2563eb",
              fontWeight: "600"
            }}
          >
            + Report Issue
          </Link>

          {complaints.length === 0 ? (
            <p>No complaints yet.</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="complaint-box">
                <h4>{c.title}</h4>
                <p>{c.description}</p>
                <p>Status: {c.status}</p>
                <p>
                  Assigned To: {c.assignedTo || "Not Assigned"}
                </p>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;