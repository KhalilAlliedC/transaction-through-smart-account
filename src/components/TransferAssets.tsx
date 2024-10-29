import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { getWalletProxy } from "../utils/walletproxy";
import { ethers } from "ethers";
import { currentChain, thirdWebClient } from "../config/thirdweb.config";

const TransferAssets = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenTransfer = async () => {
    const smartAccountAddress = "0x0fa13Cb1e4c62527F9bB50dbEb26c2575dEeAB5e";
    const tokenAddress = "0x69A80fc0AEEADAb709ac0e939E94d195D98579eb"; // SWAP token
    const recipientAddress = "0xe6a28D675f38856ad383557C76dfdA2238961A49";
    // const amount = ethers.utils.parseUnits("25", 18);
    const amount = '15';

    try {
      setIsLoading(true);
      const { provider, signer } = await getWalletProxy().getEthersProviderAndSigner();
      const sdk = new ThirdwebSDK(signer);

      // // Get the token contract
      // const token = await sdk.getToken(tokenAddress);

      // Retrieve the token contract using getContract
      const token = await sdk.getContract(tokenAddress, "token");

      // Set allowance for the smart account
      await token.setAllowance(smartAccountAddress, amount);

      // Execute the transfer
      const tx = await token.transfer(recipientAddress, amount);
      console.log("Transfer response:", tx);

      // If tx is a transaction hash, wait for its confirmation using the provider
      if (typeof tx === "string") {
        const receipt = await provider.waitForTransaction(tx);
        console.log("Transfer confirmed:", receipt);
      } else {
        console.log("Unexpected transfer response format", tx);
      }

    } catch (error: any) {
      console.error("Error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFTTransfer = async () => {
    const nftContractAddress = "0xc96939c0e48b3d1a4061263fc57cce7e2d071feb"; // NFT contract address
    const smartAccountAddress = "0x0fa13Cb1e4c62527F9bB50dbEb26c2575dEeAB5e"; // Smart account address linked with the sender's EOA
    const recipientAddress = "0xe6a28D675f38856ad383557C76dfdA2238961A49"; // Recipient's address
    const tokenId = 3; // The specific token ID to transfer
    const quantity = 1; // Only for ERC-1155 (ignore for ERC-721)

    try {
      setIsLoading(true);
      const { provider, signer } = await getWalletProxy().getEthersProviderAndSigner();
      const sdk = new ThirdwebSDK(signer);

      // Retrieve the NFT contract
      const nftContract = await sdk.getContract(nftContractAddress);

      // Set approval for the specific token ID on behalf of the smart account
      const isERC721 = await nftContract.call("supportsInterface", ["0x80ac58cd"]); // ERC-721 interface ID

      if (isERC721) {
        // Approve smart account to transfer the specific token on behalf of the EOA
        await nftContract.call("approve", [smartAccountAddress, tokenId]);
      } else {
        // Set approval for all tokens on behalf of the EOA (required for ERC-1155)
        await nftContract.call("setApprovalForAll", [smartAccountAddress, true]);
      }

      // Perform the transfer from the smart account
      let tx;
      if (isERC721) {
        tx = await nftContract.call("transferFrom", [signer.getAddress(), recipientAddress, tokenId]);
      } else {
        tx = await nftContract.call("safeTransferFrom", [signer.getAddress(), recipientAddress, tokenId, quantity, "0x"]);
      }

      console.log("NFT Transfer response:", tx);

      // Confirm the transaction
      if (typeof tx === "string") {
        const receipt = await provider.waitForTransaction(tx);
        console.log("NFT Transfer confirmed:", receipt);
      } else {
        console.log("Unexpected NFT transfer response format", tx);
      }

    } catch (error: any) {
      console.error("Error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-6" >
      {!isLoading && (
        <button className="px-3 py-2 rounded-md bg-teal-300" onClick={handleTokenTransfer}>
          Transfer tokens
        </button>
      )}

      {!isLoading && (
        <button className="px-3 py-2 rounded-md bg-teal-300" onClick={handleNFTTransfer}>
          Transfer NFTs
        </button>
      )}

      {isLoading && <p>Transaction in process...</p>}
    </div>
  );
};

export default TransferAssets;
