import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

export const thirdWebClient = createThirdwebClient({ clientId });
export const currentChain = baseSepolia;

//Definition: payment chain is the on which we want to accept payments
//Hint: It can be changed later if needed
export const paymentChain = currentChain;