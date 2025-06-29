import React, { useState } from "react";

const MedicineForm = ({ contract, account }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    manufacturer: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await contract.methods.createMedicine(
        formData.name,
        formData.brand,
        formData.manufacturer,
        parseInt(formData.quantity)
      ).send({ from: account });

      alert("Medicine created successfully!");
      setFormData({
        name: "",
        brand: "",
        manufacturer: "",
        quantity: "",
      });
    } catch (err) {
      const message = err.message || "";
      const revertReason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Medicine creation failed:", err);
      alert(`Creation failed: ${revertReason}`);
    }
  };

  const fields = [
    ["name", "Medicine Name"],
    ["brand", "Brand"],
    ["manufacturer", "Manufacturer"],
    ["quantity", "Quantity"],
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Medicine</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(([key, label]) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{label}:</label><br />
            <input
              type={key === "quantity" ? "number" : "text"}
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

export default MedicineForm;

