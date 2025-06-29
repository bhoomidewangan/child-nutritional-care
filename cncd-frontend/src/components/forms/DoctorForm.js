import React, { useState } from "react";

const DoctorForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    contact: "",
    email: "",
    degree: "",
    specialization: "",
    registrationId: "",
    wallet: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.methods.registerDoctor(
        formData.name,
        formData.gender,
        formData.dob,
        formData.contact,
        formData.email,
        formData.degree,
        formData.specialization,
        formData.registrationId,
        formData.wallet
      ).send({ from: account });

      alert("Doctor registered successfully!");
  
    } catch (err) {
      const message = err.message || "";
      const revertReason = message.includes("revert")
      ? message.split("revert")[1].trim()
      : "Transaction failed";

      console.error("Doctor registration failed:", err);
      alert(`Registration failed: ${revertReason}`);
    }
  };
   
  const fields = [
    ["name", "Name"],
        ["gender", "Gender"],
        ["dob", "Date of Birth (DD-MM-YYYY)"],
        ["contact", "Contact Number"],
        ["email", "Email"],
        ["degree", "Degree"],
        ["specialization", "Specialization"],
        ["registrationId", "Medical Registration ID"],
        ["wallet", "Wallet Address"],
  ];
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Doctor</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(([key, label]) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{label}:</label><br />
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        ))}
        <button type="submit" style={{ marginTop: "1rem", padding: "0.75rem 1.5rem" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;
