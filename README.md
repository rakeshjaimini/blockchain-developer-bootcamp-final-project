# Final project - NFT Trade
## Project description
NFT trade allows user to buy/sell/auction nft. This project is done as final project for the [Blockchain Developer
Online Bootcamp 2021 with Certification](https://courses.consensys.net/courses/blockchain-developer-bootcamp-registration-2021). Certain features are still work in progress and final product will read NFTs from user's wallet and will allow user to list these nfts for sale or for auction. Buyers will visit the site and will see list of all the available nfts for sale or auction. Buyers can buy these nfts or create an offer for auctioned nfts. Seller will get an option to accept or reject offers.
## Deployed version url
https://nfttrade.vercel.app/

## Screencast link
https://youtu.be/6R7Ed-f5ldE
## Public Ethereum wallet for certification
0x70BC05A25BE02D39eB2030dAc184E3301cD95c10
## Simple workflow
- User visits https://nfttrade.vercel.app/
- User connects their wallet through metamask.
- User selects one of the nft from buy now section and clicks more info.
- More info takes users to the nft details screen where user sees various attributes and description.
- User clicks Buy button which opens metamask for transaction confirmation.
- After successful transaction, the amount is transfered to seller and nft to the buyer.
- Nft moves from buy now section to sold section on home page.
## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## How to run this project locally:
### Prerequisites

- Node.js >= v14
- Truffle v.5.4.12 or higher
- Ganache v2.5.4 or higher
- Yarn
- `git checkout main`

### Contracts

- Run `yarn install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `7545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
  
### Frontend

- `cd client`
- `yarn install`
- `yarn start`
- Open `http://localhost:3000`

### How to populate locally deployed contract with NFT listings

```solidity
truffle migrate --network development

truffle console --network development

let instance = await NFTTrade.deployed()

instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","1",web3.utils.toWei("0.1"),true,"https://lh3.googleusercontent.com/MYk0ArAtB1GR0MzSTbWYTkB-FoKLjCw_VX7ltTuteOmfSR1BWcYPzC883tNNeYmuwBu1B0ABlsnogRgCes_9Jav2dBxBhrpaRCUX9g=w600","Look at that mask")

instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","2",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/YajdcvOrejrvSWAiKgoH1NN97VxGwv9TS-QyXfQWQqzRbi9KaoUbMmiIIQ5eTyjK9z96XEqI4I1k122Y4Mjr6Ef9odlmBEjzCSa_KA=w600","Looks rare")

instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","3",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/V6qiNY-BYdeEiuwEmEDaz29epi_OqBi71wOat12JGqpo3hzz-l9IhC2YXg4yr_hYIYkR_9eq827JA6c8oWpQIw50PvO6k91Sv616yw=w600","777 with hat")

instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","4",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/MktMpPyG32XgB6e6Q7RjChcLoUanigNM6Y2_iI8WRiqBNw5dAKp8aoi5BHbeZBGIAkwaP7GkKfNoitPiKm4juPA-uFKz-HhHr7HWIg=w600","AN 8-BIT OBITUARY OF FAMILY FIENDS")
```

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Read NFTs from user's wallet for listing.
- Transfer actual NFT to buyer.
- Enable auction and offere created, accepted and rejected notifications.
- Relisting NFTs by buyer for future sale.
- Favorite NFTs.
- Search by collection.

