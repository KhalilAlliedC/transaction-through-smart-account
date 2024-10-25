import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { getWalletProxy } from "../utils/walletproxy";

const TransferAssets = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAssetTransfer = async () => {
    const smartAccountAddress = "0x0fa13Cb1e4c62527F9bB50dbEb26c2575dEeAB5e";
    const tokenAddress = "0x69A80fc0AEEADAb709ac0e939E94d195D98579eb"; // SWAP token
    const recipientAddress = "0xe6a28D675f38856ad383557C76dfdA2238961A49";
    // const amount = ethers.utils.parseUnits("25", 18);
    const amount = '25';

    try {
      setIsLoading(true);
      const { provider, signer } = await getWalletProxy().getEthersProviderAndSigner();
      const sdk = new ThirdwebSDK(signer);

      // Get the token contract
      const token = await sdk.getToken(tokenAddress);

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

  return (
    <div>
      {!isLoading && (
        <button className="px-3 py-2 rounded-md bg-teal-300" onClick={handleAssetTransfer}>
          Transfer tokens
        </button>
      )}
      {isLoading && <p>Transaction in process...</p>}
    </div>
  );
};

export default TransferAssets;
