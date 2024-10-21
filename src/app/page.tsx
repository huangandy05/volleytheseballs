import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen pt-3 gap-2">
      <h1 className="text-3xl">VolleyTheseBalls</h1>
      <Link href="/drills">
        <Card className="w-64 h-16 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
          <h2 className="text-2xl">DRILLS</h2>
        </Card>
      </Link>
    </main>
  );
}
