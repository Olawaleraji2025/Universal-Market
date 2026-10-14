import { Inbox, RefreshCw } from "lucide-react";

import Button from "./button";

export default function EmptyStateModal({
  onRetry,
  isRetrying = false,
  title = "No products available",
  message = "There are no products in the shop right now. Please check back soon.",
  buttonText = "Refresh",
}) {
  return (
    <div className="m-auto flex h-full w-full max-w-md flex-col items-center justify-center rounded-xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
      <div className="relative">
        <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
          <Inbox className="size-8 text-emerald-600" strokeWidth={2} />
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-bold text-[#01241a]">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-5">
          <Button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-[#064e3b] text-white hover:bg-emerald-900"
          >
            <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Refreshing..." : buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}
