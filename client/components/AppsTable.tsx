import { memo, useMemo } from "react";

interface App {
  id: string;
  name: string;
  isDeployed: boolean;
  updated: string;
}

interface AppsTableProps {
  apps: App[];
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

function AppsTable({ apps, currentPage, onPageChange, pageSize = 10 }: AppsTableProps) {
  const totalPages = Math.ceil(apps.length / pageSize);
  const paginatedApps = useMemo(
    () => apps.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [apps, currentPage, pageSize],
  );

  if (apps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No apps found
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">App Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Deployed</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {paginatedApps.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{app.name}</td>
              <td className="py-3 px-4">
                {app.isDeployed ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Deployed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Draft
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(app.updated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, apps.length)} of {apps.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AppsTable);
