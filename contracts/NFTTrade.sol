// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title Contract for buying and selling NFTs
/// @author Rakesh Jaimini
/// @notice Allows a user to buy or sell a listed NFT
/// @dev Auction functionality is not implemented
contract NFTTrade is Ownable, Pausable  {
  
  /// @notice List of all NFTs
  /// @dev Keeps track of all NFTs listed
  mapping (bytes32 => NFT) public listedNFTs;

  /// @notice List of all NFT hashes.
  /// @dev Used as a helper when iterating available NFTs in frontend client.
  bytes32[] public hashList;

  /// @notice hashList length.
  /// @dev Used as a helper when iterating available NFTs in frontend client.
  uint public hashListLength; 

  enum Status {BuyNow, Sold, Auction, Offered}
  struct NFT{
    address payable seller;
    address contractAddr;
    uint tokenId;
    uint price;
    Status status;
    address payable buyer;
    string imgUrl;
    string description;
  }

  /// @notice Emitted when a NFT is listed with a price
  /// @param contractAddr NFT contract address
  /// @param tokenId NFT token id
  event LogBuyNow(address contractAddr, uint tokenId);
  
  /// @notice Emitted when a NFT is sold
  /// @param contractAddr NFT contract address
  /// @param tokenId NFT token id
  event LogSold(address contractAddr, uint tokenId);
  
  /// @notice Emitted when a NFT is listed for auction
  /// @param contractAddr NFT contract address
  /// @param tokenId NFT token id
  event LogAuction(address contractAddr, uint tokenId);
  
  /// @notice Emitted when a buyer creates an offer for a NFT
  /// @param contractAddr NFT contract address
  /// @param tokenId NFT token id
  event LogOffered(address contractAddr, uint tokenId);
  constructor() Pausable() {}

  /// @notice Calculates hash for give NFT contract address and tokenid
  /// @dev Used in frontend client to invoke buyNFT function
  /// @param _addr NFT contract address
  /// @param _tokenId NFT token id
  function hash(
    address _addr,
    uint _tokenId
    ) public pure returns (bytes32) {
      return keccak256(abi.encodePacked(_addr, _tokenId));
  }

  /// @notice Pause the buy/sell of NFTs
  /// @dev Can only be called by contract owner
  function pause() public onlyOwner whenNotPaused {
      _pause();
  }

  /// @notice Unpause the buy/sell of NFTs
  /// @dev Can only be called by contract owner
  function unpause() public onlyOwner whenPaused {
      _unpause();
  }

  /// @notice List NFT for sale or auction
  /// @dev Frontend clients can fetch ipfs data from contract address and token id for img url
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  /// @param _price Minimum selling/auction price
  /// @param _buyNow False if listing is for auction
  /// @param _imgUrl NFT image url
  /// @param _description NFT description
  function listNFT(
    address _contractAddr, 
    uint _tokenId,
    uint _price,
    bool _buyNow,
    string memory _imgUrl,
    string memory _description) public whenNotPaused  {
      bytes32 nftHash = hash(_contractAddr, _tokenId);
      require(listedNFTs[nftHash].contractAddr == payable(address(0)), "NFT already listed");

      listedNFTs[nftHash] = NFT({
        seller: payable(msg.sender),
        contractAddr: _contractAddr,
        tokenId : _tokenId,
        price : _price,
        status : Status.BuyNow,
        buyer : payable(address(0)),
        imgUrl:_imgUrl,
        description: _description
    });
    if (!_buyNow) {
      listedNFTs[nftHash].status = Status.Auction;
      emit LogAuction(_contractAddr, _tokenId);
    }
    else {
      emit LogBuyNow(_contractAddr, _tokenId);
    }
    hashList.push(nftHash);
    hashListLength = hashList.length;
  }

  /// @notice Buy NFT listed for sale
  /// @dev This will return excess amount back to the buyer
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  function buyNFT(
    address _contractAddr, 
    uint _tokenId) public payable whenNotPaused {
      bytes32 nftHash = hash(_contractAddr, _tokenId);
      require(listedNFTs[nftHash].status == Status.BuyNow, "NFT already sold");
      require(msg.value >= listedNFTs[nftHash].price,"Price mismatch");
      
      listedNFTs[nftHash].buyer = payable(msg.sender);
      listedNFTs[nftHash].status = Status.Sold;
      listedNFTs[nftHash].seller.transfer(listedNFTs[nftHash].price);
      uint amountToRefund = msg.value - listedNFTs[nftHash].price;
      if (amountToRefund > 0) {
        listedNFTs[nftHash].buyer.transfer(amountToRefund);
      }
      emit LogSold(_contractAddr, _tokenId);
    }
  
  /// @notice Create offer for NFT listed for auction
  /// @dev Price should be greater than or equal to the listing price
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  /// @param _price Offered price
  function offerNFT(
    address _contractAddr, 
    uint _tokenId,
    uint _price) public whenNotPaused {
      // TODO: add buyer address to the listed NFT with the offered price and change status to offered
    }
  
  /// @notice Accept offer created by the buyer
  /// @dev This will transfer NFT to the buyer
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  function acceptOffer(
    address _contractAddr, 
    uint _tokenId
  ) public whenNotPaused {
    // TODO: transfer amount to seller and NFT to buyer
  }

  /// @notice Reject offer created buy buyer and update minimum price
  /// @dev This will return the amount back to the buyer
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  /// @param _price Minimum selling/auction price
  function rejectOffer(
    address _contractAddr, 
    uint _tokenId,
    uint _price) public whenNotPaused {
    // TODO: transfer amount to the buyer and update minimum price
  }

  /// @notice Cancel NFT offer
  /// @dev This will return the amount back to the buyer
  /// @param _contractAddr NFT contract address
  /// @param _tokenId NFT token id
  function cancelOffer(
    address _contractAddr, 
    uint _tokenId
  ) public whenNotPaused {
    // TODO: transfer amount to the buyer
  }
}
