//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;




interface IOwnershipInstructorRegisterV1 {
    struct Instructor{
        address _impl;
        string _name;
    }
    function owner() external view returns (address);

    function instructorRegister(uint256) external view returns (address);
  
    function implementationToInstructorName(address) external view returns (string memory);

    event NewInstructor(address indexed _instructor,string _name);
    event RemovedInstructor(address indexed _instructor,string _name);
    event UnlinkedImplementation(string indexed _name,address indexed _implementation);
    event LinkedImplementation(string indexed _name,address indexed _implementation);



    function name() external view returns (string memory);

    function getInstructorByName (string memory _name) external view returns(address);

    /**
     * @dev Paginated to avoid risk of DoS.
     * @notice Function that returns the implementations of a given Instructor (pages of 150 elements)
     * @param _name name of instructor
     * @param page page index, 0 is the first 150 elements of the list of implementation.
     * @return _addresses list of implementations and _nextpage is the index of the next page, _nextpage is 0 if there is no more pages.
     */
    function getImplementationsOf(string memory _name,uint256 page)
        external
        view
        returns (address[] memory _addresses,uint256 _nextpage);

    function addInstructor(address _instructor,string memory _name) external;
    function addInstructorAndImplementation(address _instructor,string memory _name, address _implementation) external;

    function linkImplementationToInstructor(address _implementation,string memory _name) external view;
    function unlinkImplementationToInstructor(address _impl) external view;

    function removeInstructor(string memory _name) external view;
}
