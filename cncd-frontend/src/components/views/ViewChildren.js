import React, { useEffect, useState } from "react";
import ChildOverlay from "./ChildOverlay";

const ViewChildren = ({ contract, account, role }) => {
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        let childIds = [];

        if (role === "doctor") {
          
          const events = await contract.getPastEvents("ChildRegistered", {
            fromBlock: 0,
            toBlock: "latest",
          });

          for (let e of events) {
            const id = parseInt(e.returnValues.studentCode);
            const child = await contract.methods.children(id).call();
            if (child.isActive && (parseInt(child.status) !== 0) && (parseInt(child.status) !== 3)) {
              childIds.push(id);
            }
          }

        } else if (role === "teacher") {
          const ids = await contract.methods.getChildrenByTeacher(account).call();
          childIds = ids.map((id) => parseInt(id));
          
        } else if (role === "principal") {
          const principal = await contract.methods.principals(account).call();
          const schoolId = parseInt(principal.schoolId);

          const events = await contract.getPastEvents("ChildRegistered", {
            fromBlock: 0,
            toBlock: "latest",
          });

          for (let e of events) {
            const id = parseInt(e.returnValues.studentCode);
            const child = await contract.methods.children(id).call();
            if (child.isActive && parseInt(child.schoolId) === schoolId) {
              childIds.push(id);
            }
          }
        }

        const fetched = [];
        for (let id of childIds) {
          const c = await contract.methods.children(id).call();
          fetched.push(c);
        }

        setChildrenList(fetched);
      } catch (err) {
        console.error("Failed to fetch children:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [contract, account, role]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading children...</p>;
  if (childrenList.length === 0) return <p style={{ padding: "1rem" }}>No children found.</p>;

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      <h2>Child Records</h2>
      {childrenList.map((child, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            background: "#f9fafb",
          }}
        >
          <p><strong>Student Code:</strong> {child.studentCode}</p>
          <p><strong>Name:</strong> {child.name}</p>
          <p><strong>Class:</strong> {child.className}</p>
          <p><strong>School ID:</strong> {child.schoolId}</p>
          <p><strong>Status:</strong> {["Registered", "Approved", "UnderTreatment", "Treated"][child.status]}</p>

          <button
            onClick={() => setSelectedChild(child)}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#0d9488",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            View
          </button>
        </div>
      ))}

      {selectedChild && (
        <ChildOverlay
            child={selectedChild}
    contract={contract}
    role={role}
    account={account}
    onClose={() => setSelectedChild(null)}
        />
      )}
    </div>
  );
};

export default ViewChildren;
