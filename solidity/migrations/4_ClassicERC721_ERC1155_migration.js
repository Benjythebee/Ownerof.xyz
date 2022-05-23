const ClassicERC721 = artifacts.require("ClassicERC721");
const ClassicERC1155 = artifacts.require("ClassicERC1155");

module.exports = function (deployer) {
  deployer.deploy(ClassicERC721);
  deployer.deploy(ClassicERC1155);

};
