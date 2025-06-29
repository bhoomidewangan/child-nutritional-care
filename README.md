# 🍎 Child Nutritional Care DApp (CNCDApp)

A decentralized application (DApp) designed to improve and manage child nutrition in schools and communities. Built using **Solidity**, **React.js**, and **Web3.js**, and deployed on the **Sepolia Testnet**.

---

## 🚀 Features

* 👤 **Role-based dashboards**:

  * **Admin**:

    * Register doctors, teachers, and principals
    * Create & assign medicine
    * Increase global stock
  * **Doctor**:

    * View and prescribe medicines to children
    * Track treatment statuses
  * **Principal**:

    * Approve children
    * View teachers and school medicine inventory
  * **Teacher**:

    * Register children
    * View prescriptions

* 📦 School-wise medicine stock management

* 🩺 Child health tracking: Registered → Approved → UnderTreatment → Treated

* 🔐 On-chain role control via smart contract

* 🧾 Prescription history view

* 💬 Live smart contract event-based UI updates

---

## 🛠️ Tech Stack

* **Frontend**: React.js
* **Smart Contract**: Solidity
* **Interaction Library**: Web3.js
* **Contract Tooling**: Hardhat
* **Blockchain Network**: Sepolia Testnet

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/bhoomidewangan/child-nutritional-care.git
cd child-nutritional-care
```

### 2. Install Dependencies

```bash
cd cncd-frontend
npm install
```

### 3. Add Environment File

Create a `.env` file in `cncd-frontend`:

```
REACT_APP_CONTRACT_ADDRESS=your_contract_address_here
```

Replace with your actual deployed contract address.

### 4. Run the DApp Locally

```bash
npm start
```

Make sure MetaMask is installed and connected to Sepolia.

---

## 📄 Smart Contract Overview

* Role enum: `None`, `Doctor`, `Principal`, `Teacher`
* Centralized contract for managing all entities
* Events for every major action:

  * `DoctorRegistered`, `PrincipalRegistered`, `TeacherRegistered`
  * `MedicineCreated`, `MedicineAssigned`, `ChildRegistered`
  * `PrescriptionCreated`, `ChildStatusUpdated`
* School-wise medicine stock via nested mapping

---


## 👤 Author

**Bhoomi Dewangan**
B.Tech (IT), NIT Raipur

---


## 🗪 License

MIT License — free to use with attribution.
