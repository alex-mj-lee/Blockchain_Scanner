import Moralis from "moralis";
export async function getTransactionData(hash: string, network: string) {
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    });
    const response = await Moralis.EvmApi.transaction.getTransaction({
      chain: network,
      transactionHash: hash,
    });

    return response?.raw;
  } catch (e) {
    console.error(e);
  }
}
