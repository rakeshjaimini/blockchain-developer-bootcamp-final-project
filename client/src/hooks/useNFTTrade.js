import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import NFTTradeABI from '../../contract-build/contracts/NFTTrade.json';

export function useNFTTrade() {
  const { chainId } = useWeb3React();
  const [contractAddress, setContractAddress] = useState(null);

  useEffect(() => {
    if (chainId) {
      const networkId = window.ethereum.networkVersion; 
      setContractAddress(NFTTradeABI.networks[networkId]?.address);
    }
  }, [chainId]);
  return {
    contractAddress: contractAddress,
  };
}
