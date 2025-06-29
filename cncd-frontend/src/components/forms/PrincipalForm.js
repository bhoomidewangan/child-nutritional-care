import React, { useState } from "react";

const PrincipalForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolContact: "",
    schoolEmail: "",
    principalName: "",
    principalAge: "",
    principalGender: "",
    wallet: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.methods.registerPrincipal(
        formData.schoolName,
        formData.schoolAddress,
        formData.schoolContact,
        formData.schoolEmail,
        formData.principalName,
        formData.principalAge,
        formData.principalGender,
        formData.wallet
      ).send({ from: account });

      alert("Principal registered successfully!");
      setFormData({
        schoolName: "",
        schoolAddress: "",
        schoolContact: "",
        schoolEmail: "",
        principalName: "",
        principalAge: "",
        principalGender: "",
        wallet: "",
      });
    } catch (err) {
      const message = err.message || "";
      const revertReason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Principal registration failed:", err);
      alert(`Registration failed: ${revertReason}`);
    }
  };

  const fields = [
    ["schoolName", "School Name"],
    ["schoolAddress", "School Address"],
    ["schoolContact", "School Contact Number"],
    ["schoolEmail", "School Email"],
    ["principalName", "Principal's Name"],
    ["principalAge", "Principal's Age"],
    ["principalGender", "Principal's Gender"],
    ["wallet", "Wallet Address"],
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Principal</h2>
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

export default PrincipalForm;
