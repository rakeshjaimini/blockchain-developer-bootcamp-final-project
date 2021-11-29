# Design patterns

## Inheritance and Interfaces

`NFTTrade` contract inherits the OpenZeppelin `Ownable` and `Pausable` contracts. 
- `Pausable`  allows an emergency stop mechanism that can be triggered by an authorized account in case of unathorized use. `whenNotPaused` modifier stops the execution of Payable fuctions `buyNFT`
- `Ownable` contract module which provides a basic access control mechanism, where there is an account (an owner) that can be granted exclusive access to specific functions. Function `pause` is applied `onlyOwner` modifier which restricts it's usage to owner only
  
## Access Control Design Patterns

- `Ownable` is used to restrict access to certain functions. Function `pause` is applied `onlyOwner` modifier which restricts it's usage to owner only.


