import React, { useEffect, useState } from "react";
import MedicineOverlay from "./MedicineOverlay";

const GlobalMedicine = ({ contract }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMedicine, setExpandedMedicine] = useState(null); 
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const events = await contract.getPastEvents("MedicineCreated", {
          fromBlock: 0,
          toBlock: "latest",
        });

        const medMap = new Map(); 

        for (let event of events.reverse()) {
          const code = parseInt(event.returnValues.code);
          if (!medMap.has(code)) {
            const med = await contract.methods.medicines(code).call();
            if (med.exists) {
              const quantity = await contract.methods.getGlobalStock(med.name).call();
              medMap.set(code, { ...med, totalQuantity: quantity });
            }
          }
        }

        setMedicines([...medMap.values()]);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [contract]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading medicines...</p>;

  if (medicines.length === 0) return <p style={{ padding: "1rem" }}>No medicines found.</p>;

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <h2>All Medicines</h2>

      {medicines.map((m, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            background: "#f9fafb",
          }}
        >
          <p><strong>Code:</strong> {m.code}</p>
          <p><strong>Name:</strong> {m.name}</p>
          <p><strong>Brand:</strong> {m.brand}</p>
          <p><strong>Manufacturer:</strong> {m.manufacturer}</p>
          <p><strong>Total Quantity:</strong> {m.totalQuantity}</p>

          <button
            onClick={() => setExpandedMedicine(m)}
            style={{
              marginTop: "1rem",
              backgroundColor: "#0d9488",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            More
          </button>
        </div>
      ))}

      
      {expandedMedicine && (
  <MedicineOverlay
    contract={contract}
    medicine={expandedMedicine}
    onClose={() => setExpandedMedicine(null)}
  />
)}
    </div>
  );
};

export default GlobalMedicine;
