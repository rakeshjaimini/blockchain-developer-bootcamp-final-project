// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract NFTTrade is Ownable, Pausable  {

  mapping (bytes32 => NFT) public listedNFTs;

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

   /// @notice List of all property ids.
  /// @dev Used as a helper when iterating available properties in frontend client.
  bytes32[] public hashList;

  /// @notice idList length.
  /// @dev Used as a helper when iterating available properties in frontend client.
  uint public hashListLength; 

  event LogBuyNow(address contractAddr, uint tokenId);
  
  event LogSold(address contractAddr, uint tokenId);
  
  event LogAuction(address contractAddr, uint tokenId);
  
  event LogOffered(address contractAddr, uint tokenId);

  constructor() {}

  function hash(
    address _addr,
    uint _tokenId
    ) public pure returns (bytes32) {
      return keccak256(abi.encodePacked(_addr, _tokenId));
  }

  function listNFT(
    address _contractAddr, 
    uint _tokenId,
    uint _price,
    bool _buyNow,
    string memory _imgUrl,
    string memory _description) public {
      bytes32 nftHash = hash(_contractAddr, _tokenId);
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

  function buyNFT(
    address _contractAddr, 
    uint _tokenId) public payable {
      bytes32 nftHash = hash(_contractAddr, _tokenId);
      listedNFTs[nftHash].buyer = payable(msg.sender);
      listedNFTs[nftHash].status = Status.Sold;
      listedNFTs[nftHash].seller.transfer(listedNFTs[nftHash].price);
      emit LogSold(_contractAddr, _tokenId);
    }

  function offerNFT(
    address _contractAddr, 
    uint _tokenId) public {

    }
  
  function acceptOffer(
    address _contractAddr, 
    uint _tokenId
  ) public {

  }

  function rejectOffer(
    address _contractAddr, 
    uint _tokenId
  ) public {

  }

  function cancelOffer(
    address _contractAddr, 
    uint _tokenId
  ) public {

  }
}
