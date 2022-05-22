const ERC721OwnershipInstructor = artifacts.require("ERC721OwnershipInstructor");

module.exports = function (deployer) {
  deployer.deploy(ERC721OwnershipInstructor);

};
