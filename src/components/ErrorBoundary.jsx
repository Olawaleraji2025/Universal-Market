import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the full diagnostic information available to an error-reporting
    // service later, without exposing it in the production fallback UI.
    console.error("Unhandled render error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const errorMessage = this.state.error?.message;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 py-16 text-gray-900">
        <section
          className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm"
          role="alert"
          aria-labelledby="application-error-title"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
            <AlertTriangle className="size-8" aria-hidden="true" />
          </div>
          <h1
            id="application-error-title"
            className="mt-6 text-2xl font-bold text-[#01241a]"
          >
            Something went wrong
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Universal Market could not display this part of the application.
            Try again, or reload the page if the problem continues.
          </p>

          {import.meta.env.DEV && errorMessage && (
            <p className="mt-4 wrap-break-word rounded-lg bg-red-50 p-3 text-left text-xs text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#064e3b] px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064e3b]"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
            >
              Reload application
            </button>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
