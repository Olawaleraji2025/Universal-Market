import { AlertTriangle, RefreshCw } from "lucide-react";

import Button from "./button";

/**
 * ErrorModal
 * ----------
 * An in-flow error card that replaces the SkeletonCard in place, rather than
 * rendering as a modal overlay. It renders wherever it is placed in the DOM
 * (e.g. in the same flex row as the skeleton cards) and offers a "Try Again"
 * action with a spinning loader while refetching.
 *
 * Usage:
 *   const { isError, error, isFetching, refetch } = useShopProducts();
 *   <ErrorModal
 *     onRetry={() => refetch()}
 *     isRetrying={isFetching}
 *     error={error}
 *   />
 */
export default function ErrorModal({
  onRetry,
  isRetrying = false,
  title = "Failed to load data",
  message = "We couldn't fetch the information you requested. Please check your internet connection and try again.",
  error,
}) {
  return (
    <div className="w-3xs bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-center items-center h-full m-auto">
      {/* ---------- Icon ---------- */}
      <div className="flex flex-col items-center px-6 pt-10 pb-2 text-center">
        <div className="relative">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
            <AlertTriangle
              className="size-8 text-red-500"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      {/* ---------- Copy ---------- */}
      <div className="px-6 pt-4 pb-2 text-center">
        <h2 className="text-lg font-bold text-[#01241a]">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          {message}
        </p>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="px-6 pt-4 pb-6">
        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="w-full bg-[#064e3b] text-white hover:bg-emerald-900"
        >
          <RefreshCw
            className={`size-4 ${isRetrying ? "animate-spin" : ""}`}
          />
          {isRetrying ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    </div>
  );
}
