import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/chat" className="px-4 py-2 text-white bg-blue-600 rounded">Open chat Workflow</Link>
    </div>
  );
}
