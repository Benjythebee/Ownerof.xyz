

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ClassicERC721 is ERC721 {

    constructor() ERC721("Classic ERC721", "ERC721") {
    }

    function mint(uint256 _tokenId) external {
        _safeMint(_msgSender(), _tokenId);
    }

}
