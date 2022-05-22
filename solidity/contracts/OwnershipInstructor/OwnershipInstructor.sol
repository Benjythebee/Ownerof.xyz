//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../Interfaces/IOwnershipInstructor.sol";

/**
 * This is a template contract;
 * The goal of this contract is to allow people to integrate their contract into OwnershipChecker.sol
 * by generalising the obtention of the owner of NFTs.
 * The reason for this solution was because NFTs nowadays have standards, but not all NFTs support these standards.
 */
abstract contract OwnershipInstructor is IOwnershipInstructor{

/**
 * This function should be internal and should be overriden.
 * It should obtain an address as input and should return a boolean value;
 * A positive result means the given address supports your contract's interface.
 * @dev This should be overriden and replaced with a set of instructions to check the given _impl if your contract's interface.
 * See ERC165 for help on interface support.
 * @param _impl address we want to check.
 * @return bool
 * 
 */
    function isValidInterface (address _impl) public view virtual returns (bool){
        return _impl !=address(0);
    }

    /**
    * This function should be public or External and should be overriden.
    * It should obtain a uint256 token Id as input and should return an address (or address zero is no owner);
    * @dev This should be overriden and replaced with a set of instructions obtaining the owner of the given tokenId;
    *
    * @param _tokenId token id we want to grab the owner of.
    * @param _impl Address of the NFT contract
    * @param _potentialOwner A potential owner, set address zero if no potentialOwner; This is necessary for ERC1155.
    * @return address
    * 
    */
    function ownerOfTokenOnImplementation(address _impl,uint256 _tokenId,address _potentialOwner) public view virtual returns (address){
        return address(0);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return interfaceId == type(IOwnershipInstructor).interfaceId;
    }
}