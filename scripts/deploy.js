// scripts/deploy.ts
const hre = require("hardhat");

async function main() {
    console.log("Deploying contracts...");

    // 部署 GameToken
    const GameToken = await hre.ethers.getContractFactory("GameToken");
    const gameToken = await GameToken.deploy();
    await gameToken.waitForDeployment();
    console.log("GameToken deployed to:", await gameToken.getAddress());

    // 部署 GameNFT
    const GameNFT = await hre.ethers.getContractFactory("GameNFT");
    const gameNFT = await GameNFT.deploy(await gameToken.getAddress());
    await gameNFT.waitForDeployment();
    console.log("GameNFT deployed to:", await gameNFT.getAddress());

    // 部署 Marketplace
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(
        await gameToken.getAddress(),
        await gameNFT.getAddress()
    );
    await marketplace.waitForDeployment();
    console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });