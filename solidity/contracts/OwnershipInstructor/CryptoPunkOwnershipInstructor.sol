//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./OwnershipInstructor.sol";

interface ICryptoPunkContract {
    function punkIndexToAddress(uint256) external view returns (address);
}

/**
 * Ownership Instructor Wrapper that wraps around the Cryptopunk contract,
 * It tells us if _impl is the cryptopunk contract and let's us standardise ownerOf;
 *
 * The goal of this contract is to allow people to integrate their contract into OwnershipChecker.sol
 * by generalising the obtention of the owner of NFTs.
 * The reason for this solution was because NFTs nowadays have standards, but not all NFTs support these standards.
 */
contract CryptoPunkOwnershipInstructor is OwnershipInstructor{
    address cryptopunk_impl;
    constructor(){
        cryptopunk_impl = 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB;
    }

/**
 * Checks if the given contract is the cryptopunk address
 * It should obtain an address as input and should return a boolean value;
 * @dev Contains a set of instructions to check the given _impl is the cryptopunk contract
 * @param _impl address we want to check.
 * @return bool
 * 
 */
    function isValidInterface (address _impl) public view override returns (bool){
        return _impl == cryptopunk_impl;
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
        return ICryptoPunkContract(_impl).punkIndexToAddress(_tokenId);
    }
}