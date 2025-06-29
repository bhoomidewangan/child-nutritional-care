const hre = require("hardhat");

async function main() {
  const Health = await hre.ethers.getContractFactory("Health");
  const health = await Health.deploy(); // Add constructor args if any

  await health.deployed();
  console.log(`Health contract deployed at: ${health.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
