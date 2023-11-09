"use client";
import { useState } from "react";
import { Utils } from "alchemy-sdk";
import Link from "next/link";
import { getBalance, getAllTransactions } from "../hooks/useAlchemy";

export const TransactionSeach = () => {
  const [serachInput, setSerachInput] = useState(
    "0x1256497A1b0729E167BC52E2b08EE23a888184C9"
  );

  const [results, setResults] = useState<
    Array<{ metadata: { blockTimestamp: string } }>
  >([]);
  const [addressBalance, setAddressBalance] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentNetwork, setCurrentNetwork] = useState("ETH");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 25;

  const handleInputChange = (e: any) => {
    setSerachInput(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const transactionData: any = await getAllTransactions(
        serachInput,
        currentNetwork
      );
      const addressBalance = await getBalance(serachInput, currentNetwork);

      setResults(transactionData);
      setAddressBalance(Utils.formatEther(addressBalance));
    } catch (error) {
      console.error("Error searching for transactions:", error);
    }
  };
  const formattedData = (time: string) =>
    new Date(time).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  //Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentNetwork(e.target.value);
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(address.length - 6)}`;

  const handleSortByTime = () => {
    const sortedResults = [
      ...(results as Array<{ metadata: { blockTimestamp: string } }>),
    ];
    sortedResults.sort((a, b) => {
      const timeA = new Date(a.metadata.blockTimestamp).getTime();
      const timeB = new Date(b.metadata.blockTimestamp).getTime();

      if (sortOrder === "asc") {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    });

    setResults(sortedResults);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-10 text-gray-600">
      <h1 className="w-[75%] lg:w-1/2">
        Balance{" "}
        {`${shortenAddress(serachInput)}: ${
          addressBalance ? `${addressBalance} ETH` : ""
        }`}
      </h1>
      <div className="flex flex-col gap-4 w-[75%] lg:flex-row lg:w-1/2 ">
        <select
          value={currentNetwork}
          onChange={handleNetworkChange}
          className="rounded-md p-1"
        >
          <option value="ETH">ETH</option>
          <option value="Matic">Matic</option>
        </select>
        <input
          type="text"
          placeholder="Enter Address"
          value={serachInput}
          onChange={handleInputChange}
          className="rounded-md p-1 flex-grow"
        />
        <button className="rounded-md border-2 p-1" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="w-[75%] rounded-md bg-white px-3 lg:w-1/2">
        <div className="overflow-y-auto max-h-[400px] lg:max-h-[600px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left" onClick={handleSortByTime}>
                  Time {sortOrder === "asc" ? "▲" : "▼"}
                </th>

                <th className="text-left">Amount</th>
                <th className="text-left">Link</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result: any, index: number) => (
                <tr key={index}>
                  <td className="text-left">
                    {formattedData(result.metadata.blockTimestamp)}
                  </td>
                  <td className="text-left">
                    {parseFloat(result.value).toFixed(4)}
                  </td>
                  <td className="text-left">
                    <Link
                      href={`/transaction/${result.hash}/${currentNetwork}`}
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <ul className="flex">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`mx-2 cursor-pointer ${
                i + 1 === currentPage ? "text-blue-500" : ""
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
