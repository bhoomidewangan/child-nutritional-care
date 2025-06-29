import React, { useEffect, useState } from "react";
import Web3 from "web3";
import HealthABI from "./abi/Health.json";
import MainSection from "./components/MainSection";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
  const init = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();
        let user;

        if (accounts.length > 0) {
          user = accounts[0];
        } else {
          const reqAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          user = reqAccounts[0];
        }

        setAccount(user);

        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const healthContract = new web3.eth.Contract(HealthABI.abi, contractAddress);
        setContract(healthContract);

        const adminAddress = await healthContract.methods.admin().call();
        const isAdmin = user.toLowerCase() === adminAddress.toLowerCase();
        
        const roleMap = ["none", "doctor", "principal", "teacher", "admin"];
        if (isAdmin) {
          setRole(roleMap[4]);
        } else {
          
          const roleEnum = await healthContract.methods.getUserRole(user).call();
          setRole(roleMap[roleEnum]);
        }

        
      } else {
        alert("Please install MetaMask to use this DApp.");
      }
    } catch (err) {
      console.error("Error initializing app:", err);
    }
  };
   
  init();
}, []);


   if (!account) return <div>Connect your wallet</div>; 

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});
window.ethereum.on("chainChanged", () => {
  window.location.reload();
});




  
  if(role==="admin" || "doctor" || "principal" || "teacher")
  return <MainSection account={account} contract={contract} role={role}/>;   
  else 
  return <p style={{ padding: "2rem", color: "red" }}>Unauthorized or unknown role.</p>;
   
    
  
};

export default App;
