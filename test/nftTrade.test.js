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

const addSecondNFT = async (instance, tx = {}) => {
  await instance.listNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "2",
    web3.utils.toWei("0.2"),
    true,
    "https://lh3.googleusercontent.com/YajdcvOrejrvSWAiKgoH1NN97VxGwv9TS-QyXfQWQqzRbi9KaoUbMmiIIQ5eTyjK9z96XEqI4I1k122Y4Mjr6Ef9odlmBEjzCSa_KA=w600",
    "Looks rare",
    tx
  );
};

const addThirdNFT = async (instance, tx = {}) => {
  await instance.listNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "3",
    web3.utils.toWei("0.2"),
    false,
    "https://lh3.googleusercontent.com/V6qiNY-BYdeEiuwEmEDaz29epi_OqBi71wOat12JGqpo3hzz-l9IhC2YXg4yr_hYIYkR_9eq827JA6c8oWpQIw50PvO6k91Sv616yw=w600",
    "777 with hat",
    tx
  );
};

const buySecondNFT = async (instance, tx = {}) => {
  await instance.buyNFT(
    "0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79",
    "2",
    tx
  );
};

const ERR_ALREADY_LISTED = "NFT already listed";
const ERR_ALREADY_SOLD = "NFT already sold";
const ERR_NOT_OWNER = "Ownable: caller is not the owner";
const ERR_PRICE_MISMATCH = "Price mismatch";

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
    await addSecondNFT(instance, { from: owner });
  });

  /**
   * Checks that the contract inherits OpenZeppelin Ownable by using owner()
   */
  it("should add first account as owner using OpenZeppelin Ownable", async () => {
    assert.strictEqual(await instance.owner(), owner);
  });

  /**
   * Checks that the contract inherits OpenZeppelin Pausable by using paused()
   */
   it("should add OpenZeppelin pausable", async () => {
    assert.strictEqual(await instance.paused(), false);
  });

  describe("listNFT()", () => {
    /**
     * Verify:
     * * given NFT gets added to listedNFTs mapping
     * * length counter gets incremented
     */
    it("should add a NFT to listedNFTs mapping", async () => {
      const hashListLengthBefore = await instance.hashListLength();
      await addThirdNFT(instance, { from: secondAccount });
      const hashListLengthAfter = await instance.hashListLength();
      assert.equal(
        hashListLengthAfter.toNumber(),
        hashListLengthBefore.toNumber() + 1
      );
      const hash = await instance.hash("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79", 3)
      const { seller } = await instance.listedNFTs(hash);
      assert.equal(seller, secondAccount);
    });

    /**
     * * Attempt to add a NFT which already listed.
     */
    it("should fail to add a NFT which already listed", async () => {
      const hashListLengthBefore = await instance.hashListLength();
      try {
        await addSecondNFT(instance, { from: owner });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_ALREADY_LISTED);
      }
      const hashListLengthAfter = await instance.hashListLength();
      assert.equal(
        hashListLengthAfter.toNumber(),
        hashListLengthBefore.toNumber()
      );
    });
  });

  describe("buyNFT()", () => { 
    
    /**
     * * Buy for sale NFT
     */
    it("should buy a NFT", async () => {
      await buySecondNFT(instance, { from: secondAccount, value: web3.utils.toWei("0.2")});
      const hash = await instance.hash("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79", 2)
      const { status } = await instance.listedNFTs(hash);
      assert.equal(status, 1);
    });

    /**
     * * Attempt to buy already sold NFT.
     */
     it("should fail to buy already sold NFT", async () => {
      await buySecondNFT(instance, { from: secondAccount, value: web3.utils.toWei("0.2")});
      try {
        await buySecondNFT(instance, { from: secondAccount, value: web3.utils.toWei("0.2")});
      }
      catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_ALREADY_SOLD);
      }
    });

    /**
     * * Attempt to buy NFT with price less than listed price.
     */
     it("should fail to buy a NFT due to price mismatch", async () => {
      try {
        await buySecondNFT(instance, { from: secondAccount, value: web3.utils.toWei("0.1")});
      }
      catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_PRICE_MISMATCH);
      }
    });

  });
});