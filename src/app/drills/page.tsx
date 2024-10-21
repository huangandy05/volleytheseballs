import DrillsList from "@/components/DrillsList";
import Link from "next/link";
import React from "react";

const Drills = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      {/* Back button */}
      <div className="w-full">
        <Link href="/">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back
          </button>
        </Link>
      </div>
      <h1 className="text-lg">Drills</h1>
      {/* Search */}
      <DrillsList />
    </div>
  );
};

export default Drills;
