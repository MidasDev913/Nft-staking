import React, { useEffect, useState } from "react";
import StakingContract from "../Web3/StakingContract";
import web3 from "../Web3";
import { CHAIN_ID } from "../../config";
import { formatWalletAddress, readAddress, isMetaMaskInstalled } from "../../utils"

import {useAddress} from '../AddressProvider';

interface ButtonProps {
  actionText: string,
}

const ConnectButton = ({ actionText }: ButtonProps) => {
  const {address, updateAddress} = useAddress();
  const connectWallet = async () => {
    if (address) {
      console.log('Already connected');
      return;
    }
    try {
      const selectedAddress = await readAddress();
      updateAddress(selectedAddress);
    } catch (e: any) {
      console.log(e);
    }
  };


  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      console.log('Please install metamask first');
      return;
    }
    // set current address
    setTimeout(() => updateAddress(window.ethereum?.selectedAddress as string), 100);

    const listenerAccountsChanged = ([selectedAddress]: string[]) => {
      updateAddress(selectedAddress);
    };
    const listenerChainChanged = (chainId: string) => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', listenerAccountsChanged);
    window.ethereum.on('chainChanged', listenerChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', listenerAccountsChanged);
      window.ethereum.removeListener('chainChanged', listenerChainChanged);
    };

  }, []);

  return (
    <div className='flex w-full text-center rounded-[25px] h-full shadow-[0_5px_15px_#0000004d] border hover:border-gray-900'>
      <button className='flex-1 font-avenirnext-medium font-medium text-xxl rounded-[25px] text-center text-x04051a w-full h-full' onClick={connectWallet}>
        {address ? <span className="font-avenirnext-medium font-medium text-xl">{formatWalletAddress(address)}</span> : actionText}
      </button>
    </div>
  );
}

export default ConnectButton;