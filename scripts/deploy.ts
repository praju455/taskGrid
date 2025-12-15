import { ethers } from "hardhat";

async function main() {
  const Escrow = await ethers.getContractFactory("TaskGridEscrow");
  const escrow = await Escrow.deploy();
  await escrow.deployed();
  console.log("TaskGridEscrow deployed at:", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


