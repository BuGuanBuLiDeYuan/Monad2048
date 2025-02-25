// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameNFT is ERC721Enumerable, Ownable {
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
        require(_exists(tokenId), "Token does not exist");
        GameStats memory stats = tokenAttributes[tokenId];
        return (
            stats.highestScore,
            stats.onwer,
            stats.timestamp,
            tokenRarity[tokenId]
        );
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        GameStats memory stats = tokenAttributes[tokenId];
        string memory rarity = tokenRarity[tokenId];
        
        // 构建 JSON 元数据
        string memory json = string(abi.encodePacked(
            '{"name": "Game NFT #', _toString(tokenId), '", ',
            '"description": "A Game NFT representing a game achievement", ',
            '"image": "', _getImageUrl(stats.highestScore), '", ',
            '"attributes": [',
            '{"trait_type": "Highest Score", "value": "', _toString(stats.highestScore), '"}, ',
            '{"trait_type": "Rarity", "value": "', rarity, '"}, ',
            '{"trait_type": "Timestamp", "value": "', stats.timestamp, '"}',
            ']}'
        ));
        
        return string(abi.encodePacked("data:application/json;base64,", _base64(bytes(json))));
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    function _getImageUrl(uint256 score) internal pure returns (string memory) {
        // 根据分数返回不同的图片 URL
        if (score >= 2048) {
            return "https://example.com/nft/legendary.png";
        } else if (score >= 1024) {
            return "https://example.com/nft/epic.png";
        } else if (score >= 512) {
            return "https://example.com/nft/rare.png";
        } else {
            return "https://example.com/nft/common.png";
        }
    }

    function _base64(bytes memory data) internal pure returns (string memory) {
        string memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";

        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = bytes(TABLE);
        uint256 i;
        uint256 j = 0;

        for (i = 0; i < len; i += 3) {
            uint256 a = i < len ? uint8(data[i]) : 0;
            uint256 b = i + 1 < len ? uint8(data[i + 1]) : 0;
            uint256 c = i + 2 < len ? uint8(data[i + 2]) : 0;
            uint256 triple = (a << 16) | (b << 8) | c;

            result[j++] = table[triple >> 18 & 0x3F];
            result[j++] = table[triple >> 12 & 0x3F];
            result[j++] = table[triple >> 6 & 0x3F];
            result[j++] = table[triple & 0x3F];
        }

        // 添加填充
        for (i = 0; i < 2 - len % 3; i++) {
            result[encodedLen - i - 1] = bytes1("=");
        }

        return string(result);
    }

    function withdrawGameTokens(uint256 amount) public onlyOwner {
        require(gameToken.transfer(msg.sender, amount), "Transfer failed");
    }
}