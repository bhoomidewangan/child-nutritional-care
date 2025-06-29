import React, {useState} from "react";
import Header from "./Header";
import PrincipalSidebar from "./sidebars/PrincipalSidebar";
import ViewChildren from "./views/ViewChildren";
import SchoolMedicine from "./views/SchoolMedicine";
import ViewDoctors from "./views/ViewDoctors";
import ViewTeachers from "./views/ViewTeachers";
import ViewProfile from "./views/ViewPofile";


const PrincipalDashboard = ({ account, contract, role }) => {
  const [activeView, setActiveView] = useState("welcome");

  const renderMainContent = () => {
    switch (activeView) {
      case "welcome":
        return (
          <div style={{ padding: "2rem" }}>
            <h2>Welcome</h2>
            <p>You are now logged into the Child Nutritional Care DApp.</p>
            
          </div>
        );

     
      
      case "viewChildren":
        return <ViewChildren contract={contract} account={account} role={role}/>

      case "viewMedicines":
        return <SchoolMedicine contract={contract} account={account}/>

      case "viewDoctors":
        return <ViewDoctors contract={contract} account={account} role={role}/>
      
      case "viewTeachers":
        return <ViewTeachers contract={contract} account={account} role={role}/>;

      case "viewProfile":
        return <ViewProfile contract={contract} account={account} role={role} />;

      
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
          <PrincipalSidebar setActiveView={setActiveView} />
        </aside>
        <main style={{ flex: 1, background: "#f8fafc" , position: "relative"}}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default PrincipalDashboard;


