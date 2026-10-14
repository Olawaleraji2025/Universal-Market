import Button from './button';

const getVisiblePages = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages]);
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let value = start; value <= end; value += 1) {
    pages.add(value);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result = [];

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && value - previous > 1) {
      result.push('ellipsis');
    }
    result.push(value);
  });

  return result;
};

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-10 min-w-[88px] rounded-full border border-gray-200 bg-white px-3 text-sm font-semibold text-[#01241a] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        <div className="hidden items-center gap-2 sm:flex">
          {visiblePages.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-500">
                  …
                </span>
              );
            }

            const isActive = item === page;
            const pageButtonClass = isActive
              ? 'bg-[#064e3b] text-white border-[#064e3b] hover:bg-[#043d30]'
              : 'bg-white text-[#01241a] border-gray-200 hover:bg-gray-50';

            return (
              <Button
                key={item}
                type="button"
                variant="outline"
                size="sm"
                aria-label={`Page ${item}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className={`h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition ${pageButtonClass}`}
              >
                {item}
              </Button>
            );
          })}
        </div>

        <span className="sm:hidden text-sm font-medium text-[#01241a]">
          Page {page} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-10 min-w-[88px] rounded-full border border-gray-200 bg-white px-3 text-sm font-semibold text-[#01241a] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
