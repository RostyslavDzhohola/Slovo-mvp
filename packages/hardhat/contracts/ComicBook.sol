// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ComicBook is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant PRICE = 0.001 ether; // how to write price of the mint in 1 dollar ?
    string internal _baseTokenURI;
    string internal ipfsCid;
    bool private isBookIpfsCidSet = false;

    event Minted(address indexed to, uint256 tokenId);

    constructor(
        address owner,
        string memory baseTokenURI
    ) ERC721("comicBook", "CB")
    { 
        transferOwnership(owner);
        _baseTokenURI = baseTokenURI;
    }

    function safeMint() public {
        uint256 tokenId = _nextTokenId++;
        require(tokenId < MAX_SUPPLY, "ComicBook: MAX_SUPPLY reached");
        _safeMint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId);
    }

    function setIpfsCid(string memory cid) public onlyOwner {
        require(!isBookIpfsCidSet, "ComicBook: IPFS CID is already set");
        ipfsCid = cid;
        isBookIpfsCidSet = true;
    }

    function getIpfsCid() public view returns (string memory) {
        return ipfsCid;
    }

    function getBaseURI() public view returns (string memory) {
        return _baseTokenURI;
    }



}