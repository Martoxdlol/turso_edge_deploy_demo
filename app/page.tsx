import Image from "next/image";

export default function Home() {
  return (
    <main className="p-5 space-y-2">
      <h1 className="text-lg">Trying Turso deployed to Vercel edge</h1>
      <a href="/api/setup" className="underline block">
        Setup (group, and database)
      </a>
      <a href="/api/example" className="underline block">
        Run example
      </a>
      <a href="/api/cleanup" className="underline block">
        Cleanup (database and group)
      </a>
    </main>
  );
}
