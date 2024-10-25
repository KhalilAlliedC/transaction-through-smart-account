// -- // @ts-nocheck

import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { Account } from "thirdweb/wallets";
import { currentChain, thirdWebClient } from '../config/thirdweb.config';
import { ethers } from 'ethers';


interface IAsset {
  assetAddress: string,
  value: number | bigint;
}


let walletInstance: ReturnType<typeof walletProxy> | null = null;

export const getWalletProxy = (): ReturnType<typeof walletProxy> => {
  if (!walletInstance) {
    walletInstance = walletProxy();
  }
  return walletInstance;
};

export const walletProxy = () => {
  let connectedWalletAccount: Account | null = null;

  const setConnectedWalletAccount = (connectedAccount: Account) => {
    connectedWalletAccount = connectedAccount;
  };

  const getConnectedWalletAccount = () => {
    return connectedWalletAccount;
  };

  const getEthersProviderAndSigner = async () => {
    // convert a thirdweb account to ethers signer
    // let provider = await ethers6Adapter.provider.toEthers({ client: thirdWebClient, chain: currentChain });
    // let signer = await ethers6Adapter.signer.toEthers({
    //   client: thirdWebClient,
    //   chain: currentChain,
    //   account: connectedWalletAccount!,
    // });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the signer from the provider
    const signer = provider.getSigner();
    return { provider, signer };
  };


  return {
    setConnectedWalletAccount,
    getConnectedWalletAccount,
    getEthersProviderAndSigner,
  };
};