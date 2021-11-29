const NFTTrade = artifacts.require("./NFTTrade.sol");

module.exports = function (deployer) {
  deployer.deploy(NFTTrade);
};
