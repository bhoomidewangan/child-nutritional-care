import React, { useEffect, useState } from "react";

const ViewDoctors = ({ contract, account, role }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const events = await contract.getPastEvents("DoctorRegistered", {
          fromBlock: 0,
          toBlock: "latest",
        });

        const doctorList = [];

        for (let event of events) {
          const wallet = event.returnValues.wallet;
          const doctorData = await contract.methods.doctors(wallet).call();

          if (doctorData.isActive) {
            doctorList.push(doctorData);
          }
        }

        setDoctors(doctorList);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [contract]);

  const deactivateUser = async (wallet) => {
    try {
      await contract.methods.deactivateUser(wallet).send({ from: account });
      alert("Doctor deactivated successfully!");

      setDoctors(prev =>
        prev.filter(doc => doc.wallet.toLowerCase() !== wallet.toLowerCase())
      );
    } catch (err) {
      const message = err.message || "";
      const reason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Deactivation failed:", err);
      alert(`Failed to deactivate: ${reason}`);
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading doctors...</p>;

  if (doctors.length === 0) return <p style={{ padding: "1rem" }}>No active doctors found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registered Doctors</h2>
      {doctors.map((doc, index) => (
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
          <p><strong>ID:</strong> {doc.doctorId}</p>
          <p><strong>Name:</strong> {doc.name}</p>
          <p><strong>Gender:</strong> {doc.gender}</p>
          <p><strong>Date of Birth:</strong> {doc.dob}</p>
          <p><strong>Contact:</strong> {doc.contact}</p>
          <p><strong>Email:</strong> {doc.email}</p>
          <p><strong>Degree:</strong> {doc.degree}</p>
          <p><strong>Specialization:</strong> {doc.specialization}</p>
          <p><strong>Registration ID:</strong> {doc.registrationId}</p>
          <p><strong>Wallet:</strong> {doc.wallet}</p>

          {role === "admin" && (
            <button
              onClick={() => deactivateUser(doc.wallet)}
              style={{
                marginTop: "1rem",
                backgroundColor: "#dc2626",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Deactivate Doctor
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewDoctors;
