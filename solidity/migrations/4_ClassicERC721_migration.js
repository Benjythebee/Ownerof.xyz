const ClassicERC721 = artifacts.require("ClassicERC721");

module.exports = function (deployer) {
  deployer.deploy(ClassicERC721);

};
