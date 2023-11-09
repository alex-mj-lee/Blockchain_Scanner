import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="w-screen h-14 bg-black text-white flex items-center justify-between">
      <div className="ml-4">
        <Link href="/">
          <div className="text-white">Home</div>
        </Link>
      </div>
    </div>
  );
};
