import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying DareMe contract to Botchain Testnet...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (deployer) {
    console.log(`Deployer address: ${deployer.address}`);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Deployer balance: ${ethers.formatEther(balance)} tBOT`);
  }

  const DareMe = await ethers.getContractFactory("DareMe");
  const dareMe = await DareMe.deploy();
  await dareMe.waitForDeployment();

  const contractAddress = await dareMe.getAddress();

  console.log("\n====================================================");
  console.log(` DareMe successfully deployed!`);
  console.log(` Contract Address: ${contractAddress}`);
  console.log(` Network: Botchain Testnet (Chain ID: 968)`);
  console.log(` Explorer: https://scan.bohr.life/address/${contractAddress}`);
  console.log("====================================================\n");
  console.log("Next steps:");
  console.log(`1. Add to your .env.local file:`);
  console.log(`   NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`2. Restart your Next.js development server if running.`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
