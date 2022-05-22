//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./Interfaces/IOwnershipInstructor.sol";
/**
 * A register of OwnershipInstructor contracts that helps standardize "ownerOf" for NFTs.
 */
contract OwnershipInstructorRegisterV1 is Ownable {
    bytes4 public INSTRUCTOR_ID;

    ///@dev name of the contract
    string internal __name;

    struct Instructor{
        address _impl;
        string _name;
    }

    ///@dev list of Ownership instructor contracts
    Instructor[] public instructorRegister;
    /**
     * Hashed Name to instructorIndex lookup 
     */
    mapping(bytes32 => uint256) internal nameToinstructorIndex;

    ///@dev name (hashed) of instructor to list of implementations
    mapping(address => string) public implementationToInstructorName;

    ///@dev name (hashed) of instructor to list of implementations
    mapping(bytes32=>address[]) internal instructorNameToImplementationList;

    ///@dev implementation address to index inside instructorNameToImplementationList
    mapping(address => uint256) internal implementationIndex;

    /**
     * Useful for knowing if a contract has already been registered
     */
    mapping(bytes32=>bool) internal registeredHash;    
    /**
     * Useful for knowing if a Contract Instructor name has already been registered
     */
    mapping(bytes32=>bool) internal registeredName;

    event NewInstructor(address indexed _instructor,string _name);
    event RemovedInstructor(address indexed _instructor,string _name);
    event UnlinkedImplementation(string indexed _name,address indexed _implementation);
    event LinkedImplementation(string indexed _name,address indexed _implementation);

    constructor(){
        __name="OwnershipInstructorRegisterV1";
        INSTRUCTOR_ID = type(IOwnershipInstructor).interfaceId;
    }

    function hashInstructor(address _instructor) internal view returns (bytes32 _hash){
        return keccak256(_instructor.code);
    }

    function hashName(string memory _name) internal pure returns (bytes32 _hash){
        return keccak256(abi.encode(_name));
    }

    function name() public view returns (string memory){
        return __name;
    }

    function getInstructorByName (string memory _name) public view returns(Instructor memory){
        bytes32 _hash =hashName(_name);
        require(registeredName[_hash],"Name does not exist");
        return instructorRegister[nameToinstructorIndex[_hash]];
    }
    ///@dev the max number of items to show per page;
    ///@dev only used in getImplementationsOf()
    uint256 private constant _maxItemsPerPage = 150;
    /**
     * @dev Paginated to avoid risk of DoS.
     * @notice Function that returns the implementations of a given Instructor (pages of 150 elements)
     * @param _name name of instructor
     * @param page page index, 0 is the first 150 elements of the list of implementation.
     * @return _addresses list of implementations and _nextpage is the index of the next page, _nextpage is 0 if there is no more pages.
     */
    function getImplementationsOf(string memory _name,uint256 page)
        public
        view
        returns (address[] memory _addresses,uint256 _nextpage)
    {
        bytes32 _nameHash =hashName(_name);
        require(registeredName[_nameHash],"Name does not exist");
        uint256 size = instructorNameToImplementationList[_nameHash].length;
        uint256 offset = page*_maxItemsPerPage;
        uint256 resultSize;
        if(size>= _maxItemsPerPage+offset){
            // size is above or equal to 150* page index + 150
            resultSize = _maxItemsPerPage;
        }else if (size< _maxItemsPerPage+offset){
            // size is less than 150* page index + 150
            resultSize = size - offset;
        }
        address[] memory addresses = new address[](resultSize);
        uint256 index = 0;
        for (uint256 i = offset; i < resultSize+offset; i++) {
            addresses[index] = instructorNameToImplementationList[_nameHash][i];
            index++;
        }
        if(size<=(addresses.length+offset)){
            return (addresses,0);
        }else{
            return (addresses,page+1);
        }
        
    }

    function _safeAddInstructor(address _instructor,string memory _name) private {
        bytes32 _hash = hashInstructor(_instructor);
        bytes32 _nameHash = hashName(_name);
        require(!registeredHash[_hash],"Instructor has already been registered");
        require(!registeredName[_nameHash],"Instructor Name already taken");

        Instructor memory _inst = Instructor(_instructor,_name);

        instructorRegister.push(_inst);
        //instructor inserted at last index.
        nameToinstructorIndex[_nameHash]=instructorRegister.length-1;

        registeredHash[_hash]=true;
        registeredName[_nameHash]=true;
    }

    function addInstructor(address _instructor,string memory _name) public onlyOwner {
        require(_instructor !=address(0),"Instructor address cannot be address zero");
        require(bytes(_name).length>4,"Name is too short");
        require(ERC165Checker.supportsInterface(_instructor, INSTRUCTOR_ID),"Contract does not support instructor interface");

        _safeAddInstructor( _instructor, _name);

        emit NewInstructor(_instructor, _name);
    }

    function addInstructorAndImplementation(address _instructor,string memory _name, address _implementation) public onlyOwner {
        addInstructor(_instructor,_name);
        
        linkImplementationToInstructor( _implementation, _name);
    }

    function linkImplementationToInstructor(address _implementation,string memory _name) public onlyOwner {
        require(bytes(implementationToInstructorName[_implementation]).length==0,"Implementation already linked to an instructor");
        bytes32 _hash =hashName(_name);
        require(registeredName[_hash],"Name does not exist");

        implementationToInstructorName[_implementation]=_name;
        instructorNameToImplementationList[_hash].push(_implementation);
        implementationIndex[_implementation] = instructorNameToImplementationList[hashName(_name)].length-1;
        // emit event;
        emit LinkedImplementation(implementationToInstructorName[_implementation], _implementation);
        
    }

    function unlinkImplementationToInstructor(address _impl) public onlyOwner {
        require(bytes(implementationToInstructorName[_impl]).length!=0,"Implementation already not linked to any instructor.");
        bytes32 _hashName = hashName(implementationToInstructorName[_impl]);

        uint256 indexOfImplementation = implementationIndex[_impl];
        address lastImplementation = instructorNameToImplementationList[_hashName][instructorNameToImplementationList[_hashName].length-1];
        // emit event before unlinking;
        emit UnlinkedImplementation(implementationToInstructorName[_impl], _impl);

        implementationToInstructorName[_impl]="";
        instructorNameToImplementationList[_hashName][indexOfImplementation]=lastImplementation;
        instructorNameToImplementationList[_hashName].pop();
        
        implementationIndex[lastImplementation] = indexOfImplementation;
    }

    function _safeRemoveInstructor(bytes32 _nameHash) private {

        uint256 index = nameToinstructorIndex[_nameHash];
        Instructor memory current = instructorRegister[index];
        Instructor memory lastInstructor = instructorRegister[instructorRegister.length-1];

        bytes32 _byteCodeHash = hashInstructor(current._impl);

        registeredHash[_byteCodeHash]=false;
        registeredName[_nameHash]=false;

        instructorRegister[index] = lastInstructor;
        instructorRegister.pop();
        nameToinstructorIndex[_nameHash]=0;
    }

    function removeInstructor(string memory _name) public onlyOwner {
        bytes32 _hash =hashName(_name);
        Instructor memory _instructor = getInstructorByName(_name);
        require(registeredName[_hash],"Name does not exist");
        require(_instructor._impl!=address(0),"Instructor does not exist");

        uint256 size = instructorNameToImplementationList[_hash].length;
        for (uint256 i=0; i < size; i++) {  //for loop example
            unlinkImplementationToInstructor(instructorNameToImplementationList[_hash][i]);
        }

        _safeRemoveInstructor(_hash);
        emit RemovedInstructor(_instructor._impl, _name);
    }

    /**
     * @dev Given an implementation, find the best Ownership instructor contract for it.
     * @notice Find the best Ownership Instructor contract given the implementation address
     * @param _impl address of an NFT contract.
     */
    function instructorGivenImplementation(address _impl)public view returns (Instructor memory _instructor) {

        string memory _name = implementationToInstructorName[_impl];
        if(bytes(_name).length > 0){
            // Implementation was linked to an instructor contract, return the recorded Instructor;
            return getInstructorByName(_name);
        }
        // If the implementation was never linked to an instructor
        // Loop through the Instructors
        uint256 size = instructorRegister.length;

        for(uint256 i; i<size;i++ ){
            if(IOwnershipInstructor(instructorRegister[i]._impl).isValidInterface(_impl)){
                _instructor = instructorRegister[i];
                break;
            }
        }
        return _instructor;
    }

}
