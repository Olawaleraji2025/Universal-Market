import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, WifiOff } from "lucide-react";

import Button from "./button";

export default function NetworkConnectionModal({ open, onRetry, isRetrying = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#01241a]/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="No internet connection"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-100">
              <WifiOff className="h-8 w-8 text-red-500" strokeWidth={2} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#01241a]">Connection lost</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              You appear to be offline. Please check your network connection and try again.
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="w-full bg-[#064e3b] text-white hover:bg-emerald-900"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "Checking connection..." : "Retry"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
