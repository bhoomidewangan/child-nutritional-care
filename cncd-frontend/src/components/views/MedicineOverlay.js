import React, { useState, useEffect } from "react";

const MedicineOverlay = ({ contract, medicine, onClose }) => {
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [assignQuantity, setAssignQuantity] = useState("");
  const [schoolStocks, setSchoolStocks] = useState([]);

  useEffect(() => {
    const fetchSchoolStocks = async () => {
      const results = [];
      for (let id = 1; id <= 50; id++) {
        try {
          const qty = await contract.methods.getSchoolStock(medicine.name, id).call();
          if (parseInt(qty) > 0) {
            results.push({ schoolId: id, quantity: qty });
          }
        } catch (e) {
          console.warn("Skipped schoolId:", id);
        }
      }
      setSchoolStocks(results);
    };

    fetchSchoolStocks();
  }, [contract, medicine]);

  const handleIncreaseStock = async (e) => {
    e.preventDefault();
    try {
      await contract.methods
        .increaseGlobalMedicineStock(medicine.name, quantityToAdd)
        .send({ from: window.ethereum.selectedAddress });

      alert("Global stock increased");
      setQuantityToAdd("");
    } catch (err) {
      console.error("Increase stock error:", err);
      alert("Failed to increase stock");
    }
  };

  const handleAssignToSchool = async (e) => {
    e.preventDefault();
    try {
      await contract.methods
        .assignMedicineToSchool(medicine.name, schoolId, assignQuantity)
        .send({ from: window.ethereum.selectedAddress });

      alert("Medicine assigned to school");
      setSchoolId("");
      setAssignQuantity("");
    } catch (err) {
      console.error("Assign error:", err);
      alert("Failed to assign medicine");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#ffffff",
        zIndex: 10,
        padding: "2rem",
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
          backgroundColor: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>

      {/* 1. Medicine Details */}
      <h2 style={{ marginTop: 0 }}>{medicine.name}</h2>
      <p><strong>Code:</strong> {medicine.code}</p>
      <p><strong>Brand:</strong> {medicine.brand}</p>
      <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
      <p><strong>Total Global Quantity:</strong> {medicine.totalQuantity}</p>

      <hr />

      {/* 2. Increase Global Stock */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>Increase Global Stock</h3>
        <form onSubmit={handleIncreaseStock}>
          <input
            type="number"
            placeholder="Quantity to Add"
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(e.target.value)}
            required
            style={{ marginRight: "1rem", padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Increase
          </button>
        </form>
      </section>

       <hr />

      {/* 3. Assign to School */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>Assign to School</h3>
        <form onSubmit={handleAssignToSchool}>
          <input
            type="number"
            placeholder="School ID"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
            style={{ marginRight: "1rem", padding: "0.5rem" }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={assignQuantity}
            onChange={(e) => setAssignQuantity(e.target.value)}
            required
            style={{ marginRight: "1rem", padding: "0.5rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Assign
          </button>
        </form>
      </section>

       <hr />

      {/* 4. School-wise Stock */}
      <section>
        <h3>Schools with Stock</h3>
        {schoolStocks.length === 0 ? (
          <p>No school has this medicine yet.</p>
        ) : (
          <ul>
            {schoolStocks.map((s, i) => (
              <li key={i}>
                School ID: {s.schoolId} — Quantity: {s.quantity}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MedicineOverlay;
