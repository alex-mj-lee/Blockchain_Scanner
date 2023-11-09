import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";

async function setAlchemyNetwork(netWork?: string) {
  let selectedNetwork = Network.ETH_MAINNET;
  if (netWork === "Matic") {
    selectedNetwork = Network.MATIC_MAINNET;
  }
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: selectedNetwork,
  };
  const alchemy = new Alchemy(config);
  return alchemy;
}
export async function getBalance(address: string, netWork: string) {
  try {
    const alchemy = await setAlchemyNetwork(netWork);
    const response = await alchemy.core.getBalance(address, "latest");
    return response;
  } catch (error) {
    console.error("Error fetching Wallet Balance:", error);
    throw error;
  }
}

export async function getAllTransactions(address: string, netWork: string) {
  try {
    const alchemy = await setAlchemyNetwork(netWork);
    const res = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      excludeZeroValue: true,
      withMetadata: true,
      category: [
        AssetTransfersCategory.ERC1155,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.SPECIALNFT,
      ],
    });
    console.log(res.transfers);
    return res.transfers;
  } catch (error) {
    console.error("Error fetching All Transaction:", error);
    throw error;
  }
}

export async function getTransactionReceipt(txHash: string, netWork: string) {
  try {
    const alchemy = await setAlchemyNetwork(netWork);

    const response = await alchemy.core.getTransactionReceipt(txHash);
    return response;
  } catch (error) {
    console.error("Error fetching Transaction:", error);
    throw error;
  }
}

export async function getTransactionData(txHash: string, netWork: string) {
  try {
    console.log(netWork);
    const alchemy = await setAlchemyNetwork(netWork);

    const response = await alchemy.core.getTransaction(txHash);
    return response;
  } catch (error) {
    console.error("Error fetching Transaction:", error);
    throw error;
  }
}
