import { ConnectButton, useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { thirdWebClient } from "./config/thirdweb.config";
import { useEffect } from "react";
import TransferAssets from "./components/TransferAssets";
import { getWalletProxy } from "./utils/walletproxy";


function App() {
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  useEffect(() => {
    if (activeAccount && activeChain) {
      getWalletProxy().setConnectedWalletAccount(activeAccount);
    }

  }, [activeAccount, activeChain]);

  return (
    <section className="bg-gray-300 w-full min-h-screen space-y-10">
      <header className="flex items-center justify-between p-2 border-b border-b-black/5" >
        <h2 className="text-2xl font-bold" >Transaction using Smart Account</h2>

        <ConnectButton
          client={thirdWebClient}
        />

      </header>


      <div className="px-6 lg:px-8 min-h-60 flex items-center justify-center" >
        <TransferAssets />
      </div>
    </section>
  );
}

export default App;
