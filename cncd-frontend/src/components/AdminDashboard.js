import React, { useState } from "react";
import Header from "./Header";
import AdminSidebar from "./sidebars/AdminSidebar";
import DoctorForm from "./forms/DoctorForm";
import PrincipalForm from "./forms/PrincipalForm";
import TeacherForm from "./forms/TeacherForm";
import MedicineForm from "./forms/MedicineForm";
import ViewDoctors from "./views/ViewDoctors";
import ViewPrincipals from "./views/ViewPrincipals";
import ViewTeachers from "./views/ViewTeachers";
import GlobalMedicine from "./views/GlobalMedicine";

const AdminDashboard = ({ account, contract, role }) => {
  const [activeView, setActiveView] = useState("welcome");

  const renderMainContent = () => {
    switch (activeView) {
      case "welcome":
        return (
          <div style={{ padding: "2rem" }}>
            <h2>Welcome Admin</h2>
            <p>You are now logged into the Child Nutritional Care DApp.</p>
            <p>Use the sidebar to manage doctors, teachers, principals, and medicines.</p>
          </div>
        );

      case "createDoctor":
        return <DoctorForm account={account} contract={contract}/>
      
      case "createPrincipal":
        return <PrincipalForm contract={contract} account={account} />;
    
      case "createTeacher":
        return <TeacherForm contract={contract} account={account} />;

      case "createMedicine":
        return <MedicineForm contract={contract} account={account} />;

      case "viewDoctors":
        return <ViewDoctors contract={contract} account={account} role={role}/>;

      case "viewPrincipals":
        return <ViewPrincipals contract={contract} account={account} role={role} />;
     
      case "viewTeachers":
        return <ViewTeachers contract={contract} account={account} role={role} />;
      
      case "viewMedicines":
        return <GlobalMedicine contract={contract} />;


      default:
        return (
          <div style={{ padding: "2rem" }}>
            <p>Select an option from the sidebar to begin.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <Header account={account} role={role} />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside style={{ width: "250px", borderRight: "1px solid #ccc" }}>
          <AdminSidebar setActiveView={setActiveView}/>
        </aside>
        <main style={{ flex: 1, background: "#f8fafc" , position: "relative"}}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
