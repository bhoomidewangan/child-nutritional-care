import React, { useState } from "react";

const TeacherForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    schoolName: "",
    schoolId: "",
    wallet: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.methods.registerTeacher(
        formData.name,
        formData.age,
        formData.gender,
        formData.schoolName,
        parseInt(formData.schoolId),
        formData.wallet
      ).send({ from: account });

      alert("Teacher registered successfully!");
      setFormData({
        name: "",
        age: "",
        gender: "",
        schoolName: "",
        schoolId: "",
        wallet: "",
      });
    } catch (err) {
      const message = err.message || "";
      const revertReason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Teacher registration failed:", err);
      alert(`Registration failed: ${revertReason}`);
    }
  };

  const fields = [
    ["name", "Teacher's Name"],
    ["age", "Teacher's Age"],
    ["gender", "Teacher's Gender"],
    ["schoolName", "School Name"],
    ["schoolId", "School ID"],
    ["wallet", "Wallet Address"],
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Teacher</h2>
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

export default TeacherForm;
