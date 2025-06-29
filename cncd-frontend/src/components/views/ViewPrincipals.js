import React, { useEffect, useState } from "react";

const ViewPrincipals = ({ contract, account, role }) => {
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrincipals = async () => {
      try {
        const events = await contract.getPastEvents("PrincipalRegistered", {
          fromBlock: 0,
          toBlock: "latest",
        });

        let principalList = [];

        if (role === "admin" || role === "doctor") {
          for (let event of events) {
            const wallet = event.returnValues.wallet;
            const principal = await contract.methods.principals(wallet).call();

            if (principal.isActive) {
              principalList.push(principal);
            }
          }
        } else if (role === "teacher") {
          const teacher = await contract.methods.teachers(account).call();
          const teacherSchoolId = teacher.schoolId;

          for (let event of events) {
            const wallet = event.returnValues.wallet;
            const principal = await contract.methods.principals(wallet).call();

            if (
              principal.isActive &&
              parseInt(principal.schoolId) === parseInt(teacherSchoolId)
            ) {
              principalList.push(principal);
              break;
            }
          }
        }

        setPrincipals(principalList);
      } catch (err) {
        console.error("Error fetching principals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipals();
  }, [contract, account, role]);

  const deactivatePrincipal = async (wallet) => {
    try {
      await contract.methods.deactivateUser(wallet).send({ from: account });
      alert("Principal deactivated successfully!");

      setPrincipals((prev) =>
        prev.filter((p) => p.wallet.toLowerCase() !== wallet.toLowerCase())
      );
    } catch (err) {
      const message = err.message || "";
      const reason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Failed to deactivate principal:", err);
      alert(`Failed: ${reason}`);
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading principals...</p>;
  if (principals.length === 0) return <p style={{ padding: "1rem" }}>No principal(s) found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Principal Information</h2>
      {principals.map((p, index) => (
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
          <p><strong>School ID:</strong> {p.schoolId}</p>
          <p><strong>School Name:</strong> {p.schoolName}</p>
          <p><strong>School Address:</strong> {p.schoolAddress}</p>
          <p><strong>School Contact:</strong> {p.schoolContact}</p>
          <p><strong>School Email:</strong> {p.schoolEmail}</p>
          <p><strong>Principal Name:</strong> {p.principalName}</p>
          <p><strong>Principal Age:</strong> {p.principalAge}</p>
          <p><strong>Principal Gender:</strong> {p.principalGender}</p>
          <p><strong>Wallet:</strong> {p.wallet}</p>

          {role === "admin" && (
            <button
              onClick={() => deactivatePrincipal(p.wallet)}
              style={{
                marginTop: "1rem",
                backgroundColor: "#dc2626",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Deactivate Principal
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewPrincipals;
