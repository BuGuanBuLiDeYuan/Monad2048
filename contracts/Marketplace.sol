// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is ReentrancyGuard {
    IERC20 public gameToken;
    IERC721 public nft;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;

    event NFTListed(uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);

    constructor(address _gameToken, address _nft) {
        gameToken = IERC20(_gameToken);
        nft = IERC721(_nft);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.getApproved(tokenId) == address(this), "Not approved");
        
        listings[tokenId] = Listing(msg.sender, price, true);
        activeListings.push(tokenId);
        
        emit NFTListed(tokenId, msg.sender, price);
    }

    function unlistNFT(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        require(listings[tokenId].active, "Not active");
        
        listings[tokenId].active = false;
        _removeFromActiveListings(tokenId);
        
        emit NFTUnlisted(tokenId);
    }

    function buyNFT(uint256 tokenId) public nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(gameToken.transferFrom(msg.sender, listing.seller, listing.price), "Payment failed");
        
        nft.transferFrom(listing.seller, msg.sender, tokenId);
        listings[tokenId].active = false;
        _removeFromActiveListings(tokenId);
        
        emit NFTSold(tokenId, listing.seller, msg.sender, listing.price);
    }

    function _removeFromActiveListings(uint256 tokenId) private {
        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }

    function getAllListedNFTs() public view returns (
        uint256[] memory tokenIds,
        address[] memory sellers,
        uint256[] memory prices
    ) {
        uint256 count = activeListings.length;
        tokenIds = new uint256[](count);
        sellers = new address[](count);
        prices = new uint256[](count);
        
        for (uint i = 0; i < count; i++) {
            uint256 tokenId = activeListings[i];
            tokenIds[i] = tokenId;
            sellers[i] = listings[tokenId].seller;
            prices[i] = listings[tokenId].price;
        }
    }

    function isNFTListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].active;
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        require(listings[tokenId].active, "Not listed");
        return listings[tokenId].price;
    }
}