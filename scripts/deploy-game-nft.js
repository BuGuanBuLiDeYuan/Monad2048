// 重新部署NFT。让 GameNFT 合约继承 ERC721Enumerable。跟之前的 NFT 属性不一样
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

const { ethers } = require("hardhat");

async function main() {
    // 获取 GameToken 合约地址
    const gameTokenAddress = "0xC732e570851Ab4C4cd32e1960BdC6D6Ef28C802a"; // 替换为您的 GameToken 地址

    // 部署 GameNFT 合约
    const GameNFT = await ethers.getContractFactory("GameNFT");
    console.log("正在部署 GameNFT...");
    const gameNFT = await GameNFT.deploy(gameTokenAddress);

    // 等待交易确认
    await gameNFT.waitForDeployment();

    // 获取部署后的合约地址
    const gameNFTAddress = await gameNFT.getAddress();

    console.log("GameNFT 已部署到:", gameNFTAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
