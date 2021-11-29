import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { shortenAddress } from '../utils/shortenAddress';
import { colors } from '../theme';

import NFTTradeABI from '../../contract-build/contracts/NFTTrade.json';

const listingState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90%;
  flex-wrap: wrap;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  max-width: 175px;
`;

const StyledItemTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const FilteredListing = ({ listings, status }) => {
  const filtered = listings.filter((l) => l.status === status);

  if (filtered.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {filtered.map((l) => {
        const id = BigNumber.from(l.tokenId).toNumber();
        return <ListingItem item={l} />;
      })}
    </StyledDiv>
  );
};

const ListingItem = ({ item }) => {
  const { contractAddr, tokenId, description , price, imgUrl } = item;
  return (
    <StyledItem>
      <img src={imgUrl} alt="listing" style={{ height: '150px', width: '100%', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text center>{description}</Text>
        <Text center bold color={colors.darkBlue}>
          {formatEther(price)} ETH
        </Text>
        {item.status === 0 && (
          <Link
            style={{ textAlign: 'center' }}
            to={{ pathname: '/buy', search: `?nft=${contractAddr}&id=${BigNumber.from(tokenId).toNumber()}` }}
          >
            More info
          </Link>
        )}
        {item.status === 1 && <Text center>Owner: {shortenAddress(item.buyer)}</Text>}
      </StyledItemTextContainer>
    </StyledItem>
  );
};

const Listings = ({ contractAddress: contractAddress }) => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active } = useWeb3React();
  const contract = useContract(contractAddress, NFTTradeABI.abi);

  const getListedNFTs = useCallback(async (contract) => {
    try {
      const hashListLength = await contract.hashListLength();
      const hashes = await Promise.all(Array.from(Array(hashListLength.toNumber())).map((_, i) => contract.hashList(i)));
      const arr = await Promise.all(hashes.map((hash) => contract.listedNFTs(hash)));
      setListings(arr);
      setStatus(listingState.READY);
    } catch (e) {
      console.log('error:', e);
      setStatus(listingState.ERROR);
    }
  }, []);

  useEffect(() => {
    if (active) {
      getListedNFTs(contract);
    }
  }, [active]);

  if (!active) {
    return null;
  }

  if (status === listingState.LOADING) {
    return <Spinner animation="border" size="sm" style={{ color: colors.darkBlue, marginTop: '20px' }} />;
  }

  return (
    <>
      <Text t3 color={colors.green}>
        Buy Now
      </Text>
      <FilteredListing listings={listings} status={0} />
      <Text t3 color={colors.red} style={{ marginTop: '20px' }}>
        Sold
      </Text>
      <FilteredListing listings={listings} status={1} />
    </>
  );
};

export default Listings;
