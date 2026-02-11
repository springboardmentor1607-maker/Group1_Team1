import React, { useState } from "react";

export default function EditProfile() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
    alert("Profile saved (frontend only)");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Edit Profile</h2>

        {/* Header */}
        <div style={header}>
          <div style={avatar}>
            {form.fullName ? form.fullName[0].toUpperCase() : "U"}
          </div>
          <div>
            <p style={name}>{form.fullName || "Demo User"}</p>
            <p style={username}>@{form.username || "username"}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            style={input}
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={input}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={input}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            style={input}
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            style={{ ...input, height: 80 }}
          />

          <button type="submit" style={saveBtn}>
            Save Changes
          </button>
        </form>

        {/* Security Section */}
        <hr style={divider} />

        <h3>Security Settings</h3>
        <div>
          <button style={secondaryBtn}>Change Password</button>
          <button style={secondaryBtn}>Privacy Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const page = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: "40px 20px",
};

const card = {
  maxWidth: 600,
  margin: "auto",
  background: "#ffffff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const title = {
  marginBottom: 20,
  textAlign: "center",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  marginBottom: 20,
};

const avatar = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "#2563eb",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: 18,
};

const name = { margin: 0, fontWeight: "bold" };
const username = { margin: 0, color: "gray", fontSize: 14 };

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const saveBtn = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
};

const divider = { margin: "30px 0" };

const secondaryBtn = {
  marginRight: 10,
  padding: "10px 14px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};
