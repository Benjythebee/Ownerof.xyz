

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract ClassicERC1155 is ERC1155 {

    constructor() ERC1155("https://") {
    }

    function mint(uint256 _tokenId) external {
        _mint(msg.sender,_tokenId,1,"");
    }

}
