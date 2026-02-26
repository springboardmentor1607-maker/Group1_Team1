import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("complaints")) || [];

    const newComplaint = {
      id: Date.now(),
      title,
      description,
      status: "Pending",
      assignedTo: null
    };

    const updated = [...existing, newComplaint];

    localStorage.setItem("complaints", JSON.stringify(updated));

    alert("Complaint submitted successfully!");

    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Report Issue</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}

export default SubmitComplaint;