
import React, { useEffect, useState } from "react";

const ChildOverlay = ({ child, contract, role, account, onClose }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    medicineName: "",
    quantity: "",
    dosage: "",
    followupReq: false,
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const ids = await contract.methods.getPrescriptionsByChild(child.studentCode).call();
        const fetched = [];
        for (let id of ids) {
          const p = await contract.methods.getPrescription(id).call();
          fetched.push(p);
        }
        setPrescriptions(fetched);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    fetchPrescriptions();
  }, [contract, child.studentCode]);

  const handleApprove = async () => {
    try {
      await contract.methods.approveChild(child.studentCode).send({ from: account });
      alert("Child approved!");
      onClose();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Approval failed.");
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    const { medicineName, quantity, dosage, followupReq } = formData;

    try {
      await contract.methods.prescribeMedicine(
        child.studentCode,
        medicineName,
        quantity,
        dosage,
        followupReq
      ).send({ from: account });

      alert("Prescription submitted!");
      onClose();
    } catch (err) {
      console.error("Prescription failed:", err);
      alert("Failed to submit prescription.");
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#fff", padding: "2rem", overflowY: "auto", zIndex: 10 }}>
      <button onClick={onClose} style={{ float: "right", backgroundColor: "#ef4444", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "5px" }}>
        Close
      </button>

      <h2>Child Details</h2>
      <ul>
        <li><strong>Student Code:</strong> {child.studentCode}</li>
        <li><strong>Name:</strong> {child.name}</li>
        <li><strong>Class:</strong> {child.className}</li>
        <li><strong>School ID:</strong> {child.schoolId}</li>
        <li><strong>Admission No:</strong> {child.admissionNo}</li>
        <li><strong>Gender:</strong> {child.gender}</li>
        <li><strong>Age:</strong> {child.age}</li>
        <li><strong>Height:</strong> {child.height} cm</li>
        <li><strong>Weight:</strong> {child.weight} kg</li>
        <li><strong>Condition:</strong> {child.condition}</li>
        <li><strong>Status:</strong> {["Registered", "Approved", "UnderTreatment", "Treated"][child.status]}</li>
      </ul>

      {role === "principal" && parseInt(child.status) === 0 && (
        <button
          onClick={handleApprove}
          style={{ marginTop: "1rem", backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", borderRadius: "5px" }}
        >
          Approve Child
        </button>
      )}

      {role === "doctor" && parseInt(child.status) !== 0 && (
        <form onSubmit={handlePrescriptionSubmit} style={{ marginTop: "2rem" }}>
          <h3>Prescribe Medicine</h3>

          <input
            type="text"
            placeholder="Medicine Name"
            value={formData.medicineName}
            onChange={(e) => setFormData((prev) => ({ ...prev, medicineName: e.target.value }))}
            required
            style={{ marginRight: "1rem", marginBottom: "1rem" }}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
            required
            style={{ marginRight: "1rem", marginBottom: "1rem" }}
          />

          <input
            type="text"
            placeholder="Dosage"
            value={formData.dosage}
            onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
            required
            style={{ marginBottom: "1rem" }}
          />
          <br />

          <label>
            <input
              type="checkbox"
              checked={formData.followupReq}
              onChange={(e) => setFormData((prev) => ({ ...prev, followupReq: e.target.checked }))}
            />
            &nbsp; Follow-up Required
          </label>
          <br />

          <button type="submit" style={{ marginTop: "1rem", backgroundColor: "#10b981", color: "#fff", padding: "0.5rem 1.5rem", borderRadius: "5px" }}>
            Prescribe
          </button>
        </form>
      )}

      <section style={{ marginTop: "3rem" }}>
        <h3>Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions yet.</p>
        ) : (
          prescriptions.map((p, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
              <p><strong>ID:</strong> {Number(p.prescriptionId)}</p>
              <p><strong>Medicine:</strong> {p.medicineName}</p>
              <p><strong>Quantity:</strong> {Number(p.quantity)}</p>
              <p><strong>Dosage:</strong> {p.dosage}</p>
              <p><strong>Follow-up Required:</strong> {p.followupReq ? "Yes" : "No"}</p>
              <p><strong>Doctor:</strong> {p.prescribedBy}</p>
              <p><strong>Time:</strong> {new Date(Number(p.createdAt) * 1000).toLocaleString()}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ChildOverlay;
