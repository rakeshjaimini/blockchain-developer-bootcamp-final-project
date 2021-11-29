import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Link, Redirect } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import { useNFTTrade } from '../../hooks/useNFTTrade';
import Text from '../../components/Text';

import NFTTradeABI from '../../../contract-build/contracts/NFTTrade.json';

import { colors } from '../../theme';

const BuyState = {
  LOADING: 'LOADING',
  WAITING: 'WAITING_CONFIRMATIONS',
  READY: 'READY',
  ERROR: 'ERROR',
  SOLD: 'SOLD',
};

const CONFIRMATION_COUNT = 2;

const BuyButton = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const Buy = ({ location, contractAddress }) => {
  const [status, setStatus] = useState(BuyState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const contract = useContract(contractAddress, NFTTradeABI.abi);
  const searchParams = new URLSearchParams(location.search);
  const nftAddr = searchParams.get('nft');
  const tokenId = searchParams.get('id');

  useEffect(() => {
    const getListing = async () => {
      const hash = await contract.hash(nftAddr, tokenId);
      const listing = await contract.listedNFTs(hash);
      console.log(listing)
      setListing(listing);
    };
    getListing();
  }, []);

  const onBuyClick = async () => {
    setStatus(BuyState.LOADING);
    try {
      setStatus(BuyState.WAITING);
      const transaction = await contract.buyNFT(nftAddr,tokenId, {
        from: account,
        value: listing.price,
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      setTxHash(transaction.hash);
      setStatus(BuyState.SOLD);
    } catch (e) {
      setStatus(BuyState.ERROR);
      if (e.code && typeof e.code === 'number') {
        setMmError(e.message);
      }
    }
  };

  if (!active) return <Redirect to="/" />;

  const { LOADING, WAITING, READY, SOLD, ERROR } = BuyState;

  return (
    <Container fluid className="mt-5 d-flex flex-column justify-content-center align-items-center">
      {status === LOADING ||
        (status === WAITING && (
          <>
            <Spinner
              animation="border"
              size="sm"
              style={{ color: colors.green, marginTop: '20px', marginBottom: '20px' }}
            />
            {status === WAITING && <Text>Check your wallet after {CONFIRMATION_COUNT} block confirmations.</Text>}
          </>
        ))}

      {status === READY && (
        <BuyButton disabled={!listing} onClick={onBuyClick}>
          Buy
        </BuyButton>
      ) }
      {status === SOLD && !!txHash && (
        <>
          <Text t3 color={colors.green} style={{ marginTop: '20px', marginBottom: '20px' }}>
            Success
          </Text>
          <Text>
            See this transaction in{' '}
            <Link to={{ pathname: `https://ropsten.etherscan.io/tx/${txHash}` }} target="_blank">
              Etherscan
            </Link>
          </Text>
        </>
      )}
      {status === ERROR && (
        <>
          <Text style={{ marginTop: '20px', marginBottom: '20px' }} color={colors.red}>
            {mmError || 'Error encountered!'}
          </Text>
        </>
      )}
      <Link style={{ marginTop: '20px' }} to="/">
        Back to front page
      </Link>
    </Container>
  );
};

const BuyWrapper = ({ location }) => {
  const { contractAddress: contractAddress } = useNFTTrade();
  if (!contractAddress) return null;
  return <Buy location={location} contractAddress={contractAddress} />;
};

export default BuyWrapper;
