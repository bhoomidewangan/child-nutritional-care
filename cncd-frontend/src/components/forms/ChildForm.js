import React, { useState } from "react";

const ChildForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    schoolId: "",
    admissionNo: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    condition: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.methods.registerChild(
        formData.name,
        formData.className,
        parseInt(formData.schoolId),
        formData.admissionNo,
        formData.gender,
        parseInt(formData.age),
        parseInt(formData.height),
        parseInt(formData.weight),
        formData.condition
      ).send({ from: account });

      alert("Child registered successfully!");
      setFormData({
        name: "",
        className: "",
        schoolId: "",
        admissionNo: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        condition: "",
      });
    } catch (err) {
      const message = err.message || "";
      const revertReason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Child registration failed:", err);
      alert(`Registration failed: ${revertReason}`);
    }
  };

  const fields = [
    ["name", "Child's Name"],
    ["className", "Class Name"],
    ["schoolId", "School ID"],
    ["admissionNo", "Admission Number"],
    ["gender", "Gender"],
    ["age", "Age"],
    ["height", "Height (cm)"],
    ["weight", "Weight (kg)"],
    ["condition", "Health Condition"],
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register Child</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(([key, label]) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{label}:</label><br />
            <input
              type={["age", "schoolId", "height", "weight"].includes(key) ? "number" : "text"}
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

export default ChildForm;
