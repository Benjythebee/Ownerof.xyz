//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

/** 
 * Goes through a register of contracts and checks for ownership of an on-chain token.
 */
interface IOwnershipChecker{
    function ownerOfTokenAt(address _impl,uint256 _tokenId,address _potentialOwner) external view  returns (address);
}
