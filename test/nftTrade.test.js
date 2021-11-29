const NFTTrade = artifacts.require("./NFTTrade.sol");

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};

const addFirstNFT = async (instance, tx = {}) => {
  await instance.listNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "1",
    web3.utils.toWei("0.1"),
    true,
    "https://lh3.googleusercontent.com/MYk0ArAtB1GR0MzSTbWYTkB-FoKLjCw_VX7ltTuteOmfSR1BWcYPzC883tNNeYmuwBu1B0ABlsnogRgCes_9Jav2dBxBhrpaRCUX9g=w600",
    "Look at that mask",
    tx
  );
};

const addSecondProperty = async (instance, tx = {}) => {
  await instance.listNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "2",
    web3.utils.toWei("0.2"),
    false,
    "https://lh3.googleusercontent.com/YajdcvOrejrvSWAiKgoH1NN97VxGwv9TS-QyXfQWQqzRbi9KaoUbMmiIIQ5eTyjK9z96XEqI4I1k122Y4Mjr6Ef9odlmBEjzCSa_KA=w600",
    "Looks rare",
    tx
  );
};

const addThirdProperty = async (instance, tx = {}) => {
  await instance.listNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "3",
    web3.utils.toWei("0.2"),
    false,
    "https://lh3.googleusercontent.com/YajdcvOrejrvSWAiKgoH1NN97VxGwv9TS-QyXfQWQqzRbi9KaoUbMmiIIQ5eTyjK9z96XEqI4I1k122Y4Mjr6Ef9odlmBEjzCSa_KA=w600",
    "Looks rare",
    tx
  );
};

const ERR_NOT_VACANT = "This property is not vacant.";
const ERR_EXACT_AMOUNT = "Please pay exact rent amount.";
const ERR_NOT_OWNER = "Ownable: caller is not the owner";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const Status = {
  VACANT: 0,
  RENTED: 1,
  NOT_AVAILABLE: 2,
};

contract("NFTTrade", function (accounts) {
  const [owner, secondAccount] = accounts;

  beforeEach(async () => {
    instance = await NFTTrade.new();
    await addFirstNFT(instance, { from: owner });
    await addSecondProperty(instance, { from: owner });
  });

  /**
   * Checks that the contract inherits OpenZeppelin Ownable by using owner()
   */
  it("should add first account as owner using OpenZeppelin Ownable", async () => {
    assert.strictEqual(await instance.owner(), owner);
  });

  describe("addProperty()", () => {
    /**
     * Verify:
     * * given property gets added to properties mapping
     * * length counter gets incremented
     */
    it("should add a property to properties mapping", async () => {
      const hashListLengthBefore = await instance.hashListLength();
      await addThirdProperty(instance, { from: secondAccount });
      const hashListLengthAfter = await instance.hashListLength();
      assert.equal(
        hashListLengthAfter.toNumber(),
        hashListLengthBefore.toNumber() + 1
      );
      const hash = await instance.hash("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79", 3)
      const { seller } = await instance.listedNFTs(hash);
      assert.equal(seller, secondAccount);
    });
  });
});
