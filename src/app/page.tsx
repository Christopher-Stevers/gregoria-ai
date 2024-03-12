import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex h-[calc(100vh-68px)] flex-col items-center justify-center bg-main text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/member"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Team member→</h3>
            <div className="text-lg">
              Just the basics - keep track of sales targets and progress.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Team owner →</h3>
            <div className="text-lg">
              Aggregates your team members{"'"} stats so you can see what is
              working, what is not, and what you need to change.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2"></div>
      </div>
    </main>
  );
}
