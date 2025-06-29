import React from "react";

const AdminSidebar = ({ setActiveView }) => {
  const buttons = [
    { label: "Create Doctor", view: "createDoctor" },
    { label: "Create Principal", view: "createPrincipal" },
    { label: "Create Teacher", view: "createTeacher" },
    { label: "Create Medicine", view: "createMedicine" },
    { label: "View Doctors", view: "viewDoctors" },
    { label: "View Principals", view: "viewPrincipals" },
    { label: "View Teachers", view: "viewTeachers" },
    { label: "View Medicines", view: "viewMedicines" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Admin Panel</h3>
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={() => setActiveView(btn.view)}
          style={buttonStyle}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

const buttonStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "0.5rem",
  backgroundColor: "#1e3a8a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "1rem",
};

export default AdminSidebar;

