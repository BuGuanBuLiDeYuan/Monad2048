// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameNFT is ERC721, Ownable {
    IERC20 public gameToken;
    uint256 public mintPrice = 10 * 10**18; // 10 GAME tokens

    struct GameStats {
        uint256 highestScore;
        address onwer;
        string timestamp;
    }

    mapping(uint256 => GameStats) public tokenAttributes;
    mapping(uint256 => string) public tokenRarity;

    constructor(address _gameToken) ERC721("Game NFT", "GNFT") Ownable(msg.sender) {
        gameToken = IERC20(_gameToken);
    }

    function mint(uint256 highestScore, string memory timestamp) public returns (uint256) {
        require(gameToken.transferFrom(msg.sender, address(this), mintPrice), "Token transfer failed");
        
        uint256 tokenId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, highestScore)));
        _safeMint(msg.sender, tokenId);

        tokenAttributes[tokenId] = GameStats({
            highestScore: highestScore,
            onwer: msg.sender,
            timestamp: timestamp
        });

        // 根据分数设置稀有度
        if (highestScore >= 2048) {
            tokenRarity[tokenId] = "Legendary";
        } else if (highestScore >= 1024) {
            tokenRarity[tokenId] = "Epic";
        } else if (highestScore >= 512) {
            tokenRarity[tokenId] = "Rare";
        } else {
            tokenRarity[tokenId] = "Common";
        }

        return tokenId;
    }

    function getNFTDetails(uint256 tokenId) public view returns (
        uint256 highestScore,
        address player,
        string memory timestamp,
        string memory rarity
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        GameStats memory stats = tokenAttributes[tokenId];
        return (
            stats.highestScore,
            stats.onwer,
            stats.timestamp,
            tokenRarity[tokenId]
        );
    }

    function withdrawGameTokens(uint256 amount) public onlyOwner {
        require(gameToken.transfer(msg.sender, amount), "Transfer failed");
    }
}