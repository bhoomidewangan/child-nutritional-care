import React from "react";


const TeacherSidebar = ({setActiveView}) => {
  const buttons = [
    { label: "Create Child", view: "createChild" },
    { label: "View Children", view: "viewChildren" },
    { label: "View Doctors", view: "viewDoctors" },
    { label: "View Principals", view: "viewPrincipals" },
    { label: "View Profile", view: "viewProfile" },
    
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Teacher Panel</h3>
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

export default TeacherSidebar;