export default function InfoPage({ title, children }) {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#01241a] sm:text-4xl">{title}</h1>
        <div className="mt-6 space-y-4 text-base leading-7 text-gray-700">{children}</div>
      </div>
    </main>
  );
}
