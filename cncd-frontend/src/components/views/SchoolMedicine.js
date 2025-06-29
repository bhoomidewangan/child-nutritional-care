import React, { useEffect, useState } from "react";

const SchoolMedicine = ({ contract, account }) => {
  const [schoolId, setSchoolId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolMedicines = async () => {
      try {
        setLoading(true);

        const principal = await contract.methods.principals(account).call();
        const schoolId = parseInt(principal.schoolId);
        setSchoolId(schoolId);

        const events = await contract.getPastEvents("MedicineCreated", {
          fromBlock: 0,
          toBlock: "latest",
        });

        const fetched = [];

        for (let e of events) {
          const { name, brand, manufacturer, totalQuantity } = e.returnValues;

          try {
            const quantity = await contract.methods.getSchoolStock(name, schoolId).call();
            if (parseInt(quantity) > 0) {
              fetched.push({
                name,
                brand,
                manufacturer,
                quantity,
              });
            }
          } catch (err) {
            console.warn(`Failed to fetch stock for ${name}`, err);
          }
        }

        setMedicines(fetched);
      } catch (err) {
        console.error("Failed to fetch school medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolMedicines();
  }, [contract, account]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading school medicines...</p>;
  if (medicines.length === 0) return <p style={{ padding: "1rem" }}>No medicines assigned to this school.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>School Medicine Inventory</h2>
      <p><strong>School ID:</strong> {schoolId}</p>

      {medicines.map((med, idx) => (
        <div key={idx} style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          background: "#f3f4f6"
        }}>
          <p><strong>Name:</strong> {med.name}</p>
          <p><strong>Brand:</strong> {med.brand}</p>
          <p><strong>Manufacturer:</strong> {med.manufacturer}</p>
          <p><strong>Current Stock in School:</strong> {med.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default SchoolMedicine;
