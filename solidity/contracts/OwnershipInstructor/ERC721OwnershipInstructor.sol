//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../Interfaces/IOwnershipInstructor.sol";

/**
 * This is a template contract;
 * The goal of this contract is to allow people to integrate their contract into OwnershipChecker.sol
 * by generalising the obtention of the owner of NFTs.
 * The reason for this solution was because NFTs nowadays have standards, but not all NFTs support these standards.
 */
contract ERC721OwnershipInstructor is IERC165, IOwnershipInstructor{
    bytes4 internal ERC721_ID = type(IERC721).interfaceId;
    using ERC165Checker for address;
    constructor(){

    }

/**
 * Checks if the given contract supports the ERC721 interface.
 * It should obtain an address as input and should return a boolean value;
 * A positive result means the given address supports ERC721 interface.
 * @dev Contains a set of instructions to check the given _impl is ERC721 compatible
 * See ERC165 for help on interface support.
 * @param _impl address we want to check.
 * @return bool
 * 
 */
    function isValidInterface (address _impl) public view override returns (bool){
        return _impl.supportsInterface(ERC721_ID);
    }

    /**
    * See {OwnershipInstructor.sol}
    * It should obtain a uint256 token Id as input and the address of the implementation 
    * It should return an address (or address zero is no owner);
    *
    * @param _tokenId token id we want to grab the owner of.
    * @param _impl Address of the NFT contract
    * @param _potentialOwner (OPTIONAL) A potential owner, set address zero if no potentialOwner;
    * @return address
    * 
    */
    function ownerOfTokenOnImplementation(address _impl,uint256 _tokenId,address _potentialOwner) public view override returns (address){
        require(isValidInterface(_impl),"Invalid interface");
        return ERC721(_impl).ownerOf(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IOwnershipInstructor).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}