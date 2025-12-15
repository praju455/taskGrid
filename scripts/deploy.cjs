const hre = require("hardhat");

async function main() {
  const Escrow = await hre.ethers.getContractFactory("TaskGridEscrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  console.log("TaskGridEscrow deployed at:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});