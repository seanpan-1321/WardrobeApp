import { mockItems } from "@/lib/mock-items";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black sm:px-10">
      <main className="flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Wardrobe App
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Upload your clothes, tag them, and build outfits from what you
            already own.
          </p>
        </header>

        <button
          type="button"
          className="flex items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-4 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          + Add clothing item
        </button>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Your wardrobe
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {mockItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {item.name}
                </p>
                <dl className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between gap-2">
                    <dt>Category</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Color</dt>
                    <dd>{item.color}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Season</dt>
                    <dd>{item.season}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Style</dt>
                    <dd>{item.style}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
