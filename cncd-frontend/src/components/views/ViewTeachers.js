import React, { useEffect, useState } from "react";

const ViewTeachers = ({ contract, account, role }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const events = await contract.getPastEvents("TeacherRegistered", {
          fromBlock: 0,
          toBlock: "latest",
        });

        let teacherList = [];

        if (role === "admin" || role === "doctor") {
          for (let event of events) {
            const wallet = event.returnValues.wallet;
            const teacher = await contract.methods.teachers(wallet).call();

            if (teacher.isActive) {
              teacherList.push(teacher);
            }
          }
        } else if (role === "principal") {
          const principal = await contract.methods.principals(account).call();
          const schoolId = principal.schoolId;

          for (let event of events) {
            const wallet = event.returnValues.wallet;
            const teacher = await contract.methods.teachers(wallet).call();

            if (
              teacher.isActive &&
              parseInt(teacher.schoolId) === parseInt(schoolId)
            ) {
              teacherList.push(teacher);
            }
          }
        }

        setTeachers(teacherList);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [contract, account, role]);

  const deactivateTeacher = async (wallet) => {
    try {
      await contract.methods.deactivateUser(wallet).send({ from: account });
      alert("Teacher deactivated!");

      setTeachers((prev) =>
        prev.filter((t) => t.wallet.toLowerCase() !== wallet.toLowerCase())
      );
    } catch (err) {
      const message = err.message || "";
      const reason = message.includes("revert")
        ? message.split("revert")[1].trim()
        : "Transaction failed";

      console.error("Deactivation failed:", err);
      alert(`Failed: ${reason}`);
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading teachers...</p>;
  if (teachers.length === 0) return <p style={{ padding: "1rem" }}>No active teachers found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registered Teachers</h2>
      {teachers.map((t, index) => (
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
          <p><strong>Teacher ID:</strong> {t.teacherId}</p>
          <p><strong>Name:</strong> {t.name}</p>
          <p><strong>Age:</strong> {t.age}</p>
          <p><strong>Gender:</strong> {t.gender}</p>
          <p><strong>School Name:</strong> {t.schoolName}</p>
          <p><strong>School ID:</strong> {t.schoolId}</p>
          <p><strong>Wallet:</strong> {t.wallet}</p>

          {role === "admin" && (
            <button
              onClick={() => deactivateTeacher(t.wallet)}
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
              Deactivate Teacher
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewTeachers;
