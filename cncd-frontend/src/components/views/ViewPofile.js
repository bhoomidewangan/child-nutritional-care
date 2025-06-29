import React, { useEffect, useState } from "react";

const ViewProfile = ({ contract, account, role }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let userData;

        if (role === "doctor") {
          userData = await contract.methods.doctors(account).call();
        } else if (role === "principal") {
          userData = await contract.methods.principals(account).call();
        } else if (role === "teacher") {
          userData = await contract.methods.teachers(account).call();
        }

        setProfile(userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contract, account, role]);

  if (loading) return <p>Loading your profile...</p>;

  if (!profile || !profile.isActive) {
    return <p style={{ color: "red" }}>Profile not found or inactive.</p>;
  }

  
  const cleanEntries = Object.entries(profile).filter(
    ([key, value]) =>
      isNaN(Number(key)) && key !== "__length__" && key !== "isActive"
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Profile ({role})</h2>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {cleanEntries.map(([key, value], index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewProfile;
