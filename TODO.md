# Universal-Market - Admin Dashboard

- [x] Create `src/components/Admin/Dashboard.jsx` with:
  - [x] Top statistics cards
  - [x] Recent requests section
  - [x] Recent products section
- [ ] Render Dashboard on the admin page by wiring it into `src/App.jsx`
- [ ] Run dev server and verify UI

## React Error Boundary

- [x] Add a reusable `ErrorBoundary` component in `src/components/ErrorBoundary.jsx`.
- [x] Wrap the application in the boundary from `src/main.jsx`.

### What an error boundary is

An error boundary is a React class component that catches JavaScript errors
thrown while rendering its descendant components, in their constructors, or in
their lifecycle methods. It replaces the broken component tree with a fallback
UI instead of allowing the entire React application to become blank.

This project uses `getDerivedStateFromError()` to switch to a friendly fallback
screen and `componentDidCatch()` to log the error and diagnostic information.
The fallback provides two recovery actions:

- **Try again** clears the boundary state and attempts to render the application
  again.
- **Reload application** performs a full browser reload, which is useful when a
  stale bundle or unrecoverable state caused the failure.

The error message is shown only during development. Users in production see a
safe, general message rather than internal implementation details.

### Where it is implemented

The app now uses a route-scoped boundary in `src/App.jsx` so the navbar, footer,
and global modals stay active while the current page is isolated if it crashes.
The landing page itself is also wrapped in a page-level `ErrorBoundary` in
`src/pages/LandingPage.jsx`, which is ideal for this project because the
homepage composes multiple sections and the product-card section is the most
likely place for a render error.

### What it does not catch

An error boundary is not a replacement for all error handling. It does **not**
catch errors from:

- Event handlers such as button clicks.
- Asynchronous callbacks, timers, promises, or Supabase mutations.
- Server-side rendering.
- Errors thrown inside the boundary itself.

Those cases still need local `try/catch`, rejected-promise handling, or form
error state. Expected data-fetching failures should also keep their existing
React Query `isError` and retry UI; a network failure is not automatically a
component render failure.

The boundary is a last-resort render-error safety net, not a substitute for a
not-found route or an error state for expected API and form failures.

