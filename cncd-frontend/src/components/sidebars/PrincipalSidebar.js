import React from "react";


const PrincipalSidebar = ({ setActiveView }) => {
  const buttons = [
    { label: "View Children", view: "viewChildren" },
    { label: "View Medicine", view: "viewMedicines" },
    { label: "View Doctors", view: "viewDoctors" },
    { label: "View Teachers", view: "viewTeachers" },
    { label: "View Profile", view: "viewProfile" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Principal Panel</h3>
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

export default PrincipalSidebar;

