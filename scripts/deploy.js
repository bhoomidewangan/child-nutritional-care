const hre = require("hardhat");

async function main() {
  // Get the contract factory for Health
  const Health = await hre.ethers.getContractFactory("Health");

  // Deploy the contract (no constructor arguments)
  const health = await Health.deploy();
  await health.waitForDeployment();

  // Log the deployed address
  console.log(`Health contract deployed to: ${health.target}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
