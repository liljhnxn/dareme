import hre from "hardhat";

const { ethers } = hre;

async function main() {
  const network = hre.network.name;
  console.log("----------------------------------------------------");
  console.log(`Deploying DareMe contract to network: ${network}...`);
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check PRIVATE_KEY in .env");
  }

  console.log(`Deployer address: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  const feeData = await ethers.provider.getFeeData();
  console.log(`Current gasPrice: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "N/A"} Gwei`);

  const DareMe = await ethers.getContractFactory("DareMe");
  // Deploy with exact gasPrice to prevent overpaying fees
  const dareMe = await DareMe.deploy({
    gasPrice: feeData.gasPrice ?? 20000000000n,
  });
  await dareMe.waitForDeployment();

  const contractAddress = await dareMe.getAddress();

  const explorerUrl =
    network === "botchainMainnet"
      ? `https://scan.botchain.ai/address/${contractAddress}`
      : `https://scan.bohr.life/address/${contractAddress}`;

  console.log("\n====================================================");
  console.log(` DareMe successfully deployed!`);
  console.log(` Network: ${network}`);
  console.log(` Contract Address: ${contractAddress}`);
  console.log(` Explorer: ${explorerUrl}`);
  console.log("====================================================\n");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
