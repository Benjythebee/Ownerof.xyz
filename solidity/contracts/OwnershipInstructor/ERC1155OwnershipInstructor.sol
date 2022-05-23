//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "../Interfaces/IOwnershipInstructor.sol";

/**
 * OwnershipInstructor wrapper around the ERC1155 standard.
 * The goal of this contract is to allow people to integrate their contract into OwnershipChecker.sol
 * by generalising the obtention of the owner of NFTs.
 * The reason for this solution was because NFTs nowadays have standards, but not all NFTs support these standards.
 */
contract ERC1155OwnershipInstructor is IERC165, IOwnershipInstructor{
    bytes4 internal ERC1155_ID = type(IERC1155).interfaceId;
    constructor(){

    }

/**
 * Checks if the given contract supports the ERC1155 interface.
 * It should obtain an address as input and should return a boolean value;
 * A positive result means the given address supports ERC1155 interface.
 * @dev Contains a set of instructions to check the given _impl is ERC1155 compatible
 * See ERC165 for help on interface support.
 * @param _impl address we want to check.
 * @return bool
 * 
 */
    function isValidInterface (address _impl) public view override returns (bool){
        if(ERC165Checker.supportsERC165(_impl)){
            return ERC165Checker.supportsInterface(_impl, ERC1155_ID);
        }else{
            return false;
        }
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
        if(ERC1155(_impl).balanceOf(_potentialOwner, _tokenId)>0){
            return _potentialOwner;
        }else{
            return address(0);
        }
    }

    /**
     * See ERC165 -supportInterface()
     */
    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IOwnershipInstructor).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}