import React from "react";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PrincipalDashboard from "./PrincipalDashboard";
import TeacherDashboard from "./TeacherDashboard";

const MainSection = ({ account, contract, role }) => {
  const sharedProps = { account, contract, role };

  switch (role) {
    case "admin":
      return <AdminDashboard {...sharedProps} />;
    case "doctor":
      return <DoctorDashboard {...sharedProps} />;
    case "principal":
      return <PrincipalDashboard {...sharedProps} />;
    case "teacher":
      return <TeacherDashboard {...sharedProps} />;
    default:
      return <p style={{ padding: "2rem", color: "red" }}>Unauthorized or unknown role.</p>;
  }
};

export default MainSection;

