import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying DareMe contract to BOT Chain Mainnet...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check PRIVATE_KEY in .env");
  }

  console.log(`Deployer address: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  const feeData = await ethers.provider.getFeeData();
  console.log(`Current gasPrice: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "20"} Gwei`);

  const DareMe = await ethers.getContractFactory("DareMe");
  const dareMe = await DareMe.deploy({
    gasPrice: feeData.gasPrice ?? 20000000000n,
  });
  await dareMe.waitForDeployment();

  const contractAddress = await dareMe.getAddress();

  console.log("\n====================================================");
  console.log(" DareMe successfully deployed!");
  console.log(" Network: BOT Chain Mainnet (Chain ID: 677)");
  console.log(` Contract Address: ${contractAddress}`);
  console.log(` Explorer: https://scan.botchain.ai/address/${contractAddress}`);
  console.log("====================================================\n");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
