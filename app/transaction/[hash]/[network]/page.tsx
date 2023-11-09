import { Navbar } from "@/app/component/Navbar";
import { Utils } from "alchemy-sdk";
import { getTransactionData } from "@/app/hooks/useMoralis";
import { ReactNode } from "react";
const Transaction = async ({
  params,
}: {
  params: {
    hash: string;
    network: string;
  };
}) => {
  const { hash, network } = params;
  const txData = await getTransactionData(
    hash,
    network === "ETH" ? "0x1" : "0x89"
  );

  const gasPrice = parseInt(txData ? txData.gas_price : "");
  const gasUsed = parseInt(txData ? txData.receipt_gas_used : "");
  const txGasFee = gasPrice * gasUsed;

  const shortenHash = (hash: string) =>
    `${hash.slice(0, 8)}...${hash.slice(hash.length - 8)}`;

  function formatDate(inputDate: string) {
    const date = new Date(inputDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <div className="px-2 bg-gray-300 w-full h-screen flex flex-col gap-4 items-center">
        <h2 className="text-xl font-bold mt-4">Transaction Info</h2>
        <div className="text-gray-700 w-5/6 lg:w-2/5 h-2/4 border-2 rounded-md p-3 flex flex-col gap-4 pl-4">
          <p>From: {txData?.from_address}</p>
          <p>To: {txData?.to_address as ReactNode}</p>
          <p>Amount:{txData?.value ? Utils.formatEther(txData?.value) : ""}</p>
          <p>Date: {txData ? formatDate(txData?.block_timestamp) : ""}</p>
          <p>
            Confirmation:{" "}
            {txData?.receipt_status === "1" ? "Successful" : "Failed"}
          </p>
          <p>Gas Fee: {txGasFee}</p>
          <p>BlockHash: {shortenHash(txData?.block_hash ?? "")}</p>
          <p>Network: {network}</p>
        </div>
      </div>
    </div>
  );
};
export default Transaction;
