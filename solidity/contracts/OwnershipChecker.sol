//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./InstructorRegister.sol";
import "./Interfaces/IOwnershipInstructor.sol";

/**
 * Goes through a register of contracts and checks for ownership of an on-chain token.
 */
contract OwnershipCheckerV1 is ERC165 {

    string internal _name;
    string internal _symbol;

    address public register;

    constructor(address _register){
        _name="OwnershipCheckerV1";
        _symbol = "CHECK";
        _register = _register;
    }

    function name() public view returns (string memory){
        return _name;
    }
    
    function symbol() public view returns (string memory){
        return _symbol;
    }


    function ownerOfTokenAt(address _impl,uint256 _tokenId,address _potentialOwner) external view  returns (address){
        OwnershipInstructorRegisterV1 reg = OwnershipInstructorRegisterV1(register);
        OwnershipInstructorRegisterV1.Instructor memory object = reg.instructorGivenImplementation(_impl);
        if(object._impl == address(0)){
            return address(0);
        }else{
            return IOwnershipInstructor(object._impl).ownerOfTokenOnImplementation(_impl, _tokenId, _potentialOwner);
        }
    }

    
}
