import React from "react";

const Header = ({account, contract, role}) => {
  const formatRole = (r) => r.charAt(0).toUpperCase() + r.slice(1);

  return (
    <header
      style={{
        backgroundColor: "#1e293b",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #0f172a",
      }}
    >
      <div style={{ fontSize: "0.9rem", color: "#cbd5e1", fontFamily: "monospace" }}>
        Connected: {account}
      </div>
      
      <div>
        <h2 style={{ margin: 0 }}>CNCDApp</h2>
        <p style={{ fontSize: "0.9rem", margin: 0, color: "#cbd5e1" }}>
          Role: <strong>{formatRole(role)}</strong>
        </p>
      </div>

      
    </header>
  );
};

export default Header;
