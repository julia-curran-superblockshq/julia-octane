import { useState, useMemo, useCallback } from "react";
import { useApiData } from "@/hooks/useApiData.js";
import AppsTable from "@/components/AppsTable.js";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, fetching, isError, error } = useApiData("GetApps", {});

  const filteredApps = useMemo(() => {
    if (!data?.apps) return [];
    if (!search.trim()) return data.apps;
    const q = search.toLowerCase();
    return data.apps.filter((app) => app.name.toLowerCase().includes(q));
  }, [data, search]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="min-h-svh flex flex-col items-center py-12 px-4 gap-10">
      {/* Octane Button */}
      <button className="px-16 py-8 text-4xl font-bold bg-green-600 text-white rounded-2xl hover:bg-green-700 active:scale-95 transition-all shadow-lg">
        octane
      </button>

      {/* Apps Section */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Apps</h2>
          {fetching && !loading && (
            <span className="text-xs text-gray-400">Updating…</span>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search apps…"
          value={search}
          onChange={handleSearchChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Failed to load apps: {error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "Unknown error"}
          </div>
        )}

        {/* Table */}
        {!loading && !isError && (
          <div className={fetching ? "opacity-70" : ""}>
            <AppsTable
              apps={filteredApps}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
