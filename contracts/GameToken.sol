// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    uint256 public constant DAILY_REWARD = 100 * 10**18; // 100 tokens
    mapping(address => uint256) public lastRewardTime;

    constructor() ERC20("Game Token", "GAME") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**18); // 初始铸造 1,000,000 代币
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function airdropToUser(address user, uint256 amount) public onlyOwner {
        _mint(user, amount);
    }

    function hasClaimedToday(address user) public view returns (bool) {
        return (block.timestamp - lastRewardTime[user]) < 24 hours;
    }

    function checkAndAirdrop(address user) public returns (bool) {
        if (!hasClaimedToday(user)) {
            lastRewardTime[user] = block.timestamp;
            _mint(user, DAILY_REWARD);
            return true;
        }
        return false;
    }
}