import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const initialData = {
    username: "demo_user",
    email: "demo@cleanstreet.com",
    fullName: "Demo User",
    phone: "+1-555-123-4567",
    location: "Downtown District",
    bio: "Active citizen helping to improve our community through CleanStreet reporting.",
  };

  const [formData, setFormData] = useState(initialData);
  const [savedData, setSavedData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage("");
  };

  const handleCancel = () => {
    setFormData(savedData); // restore old data
    setEditMode(false);
    setMessage("");
  };

  const handleSave = () => {
    setSavedData(formData); // pretend save
    setEditMode(false);
    setMessage("Profile updated successfully ✅");
  };

  return (
    <div className="profile-page">
      <div className="profile-grid">
        {/* LEFT PROFILE CARD */}
        <div className="profile-card">
          <div className="avatar">
            {savedData.fullName.substring(0, 2).toUpperCase()}
          </div>
          <h2>{savedData.fullName}</h2>
          <p className="username">@{savedData.username}</p>
          <span className="badge">Citizen</span>
          <p className="bio-text">{savedData.bio}</p>
          <p className="member">Member since 7/3/2025</p>
        </div>

        {/* RIGHT ACCOUNT CARD */}
        <div className="info-card">
          <div className="info-header">
            <div>
              <h2>Account Information</h2>
              <p>Update your personal details</p>
            </div>

            {!editMode ? (
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <div className="action-buttons">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="form-grid">
            {[
              ["username", "Username"],
              ["email", "Email"],
              ["fullName", "Full Name"],
              ["phone", "Phone Number"],
            ].map(([name, label]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="form-group full">
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                disabled={!editMode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                disabled={!editMode}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && <p className="success-msg">{message}</p>}
        </div>
      </div>

      {/* SECURITY SECTION */}
      <div className="security-card">
        <h2>Security Settings</h2>
        <p>Manage your account security and privacy</p>

        <div className="security-buttons">
          <button>Change Password</button>
          <button>Privacy Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
