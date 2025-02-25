# 2048 游戏 NFT 市场

[English](README.md) | [中文](README_CN.md)

一个基于区块链的 2048 游戏，集成了 NFT 铸造和交易市场功能，玩家可以将游戏成就铸造为 NFT 并在市场上交易。现在支持 Monad Testnet，独特的 NFT 设计存储在 IPFS 上。

## 功能特点

- 🎮 经典的 2048 游戏玩法
- 🎨 游戏成就 NFT 铸造系统，具有独特设计
- 💰 NFT 交易市场
- 🖼️ NFT 图片存储在 IPFS 上
- 🎁 每日空投代币奖励
- 📱 响应式设计，支持移动端
- 🔗 基于以太坊的智能合约

## 技术栈

- 前端:
  - Next.js
  - React
  - TypeScript
  - CSS Modules
  - Ethers.js

- 智能合约:
  - Solidity
  - ERC20 代币
  - ERC721 NFT
  - 交易市场合约

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/SuruiLiu/Gamefi-2048.git
cd Gamefi-2048
```

2. 安装依赖
```bash
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## 项目结构

```
Gamefi-2048/
├── components/      # React 组件
├── contracts/       # 智能合约相关文件
├── styles/         # CSS 样式文件
├── utils/          # 工具函数
├── pages/          # Next.js 页面
└── public/         # 静态资源
```

## 游戏玩法

1. 连接 MetaMask 钱包
2. 使用方向键或滑动控制方块移动
3. 合并相同数字的方块
4. 达到目标分数后可以铸造 NFT
5. 在市场中交易你的 NFT

## 合约地址

> 注意：所有合约都部署在 Sepolia 测试网上。请确保您的钱包中有一定数量的 Sepolia 测试币，以便接收每日空投和与合约进行交互。

- GameToken: `0x5d768b72b6a41cB84B021A169E0B77a7b6b06f49`
- GameNFT: `0x37eAD756497bBc8e69a16DC260FaB698309b0067`
- Marketplace: `0x3045e820CcF4059cE1747F033e8D6246F43850dB`

### Telos 测试网
- GameToken: `0x09421D4e8594D3B19ABFc9c1C44096fa3BaAB6e1`
- GameNFT: `0x459287afB0daf7e7FDCcA4bda08C8a5bd0BfE230`
- Marketplace: `0x60cda54041199A7Fa74738053F6D78527A9120c6`

### Avalanche Fuji
- GameToken: `0x4A3Ec63705BB4BCcBaFcabfD8D7B6e9986082489`
- GameNFT: `0x63F6082C3B8193d43EE146d790DF30925442B645`
- Marketplace: `0x459287afB0daf7e7FDCcA4bda08C8a5bd0BfE230`

### NFT 图片
- 传奇: `https://ipfs.io/ipfs/bafybeicc4xossvnz3acndhqw4zcs4xa2xgiyotpvb3ptishm75qtyeszwq`
- 史诗: `https://ipfs.io/ipfs/bafybeifh6ifdof7mee7rqkw355tnxh2qrlu2nudze7dhbbxeqcvpuele7q`
- 稀有: `https://ipfs.io/ipfs/bafybeiaf3fy7r2evvqlhqqpbwla3lsurie2h6cwanalp7fzpxn3cq7pwgy`
- 普通: `https://ipfs.io/ipfs/bafybeighwgusfefm23avzsxpaqbkacrqmywfunx3lx3nywmf23uwxvb45i`

您可以从以下水龙头获取测试币：
https://testnet.monad.xyz/

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 提交问题和建议
- 改进文档
- 修复 bug
- 添加新功能
- 优化性能

### 贡献步骤

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 使用 TypeScript 编写代码
- 保持代码格式统一（使用 Prettier）
- 确保通过所有测试
- 添加必要的注释和文档

## 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解更多详情。

## 联系我们

如果你有任何问题或建议，欢迎通过以下方式联系我们：

- 提交 Issue
- 发送 Pull Request
- 发送邮件至 [lsruirui@163.com]

## 致谢

- 感谢所有贡献者的付出
- 感谢 [OpenZeppelin](https://openzeppelin.com/) 提供安全的智能合约库
- 感谢原版 2048 游戏的启发 