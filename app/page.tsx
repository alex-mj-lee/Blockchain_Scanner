import { Navbar } from "@/app/component/Navbar";
import { TransactionSeach } from "./component/TransactionSearch";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <div className="px-2 bg-gray-300 w-full h-screen">
        <TransactionSeach />
      </div>
    </main>
  );
}
