export const Pagination = ({ totalPages, page, setPage }) => {
    const maxVisiblePages = 5; 
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (page <= halfMaxVisible) {
        startPage = 1;
        endPage = maxVisiblePages;
      }
      else if (page + halfMaxVisible >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
      else {
        startPage = page - halfMaxVisible;
        endPage = page + halfMaxVisible;
      }
    }
  
    return (
      totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`
                px-3 py-1 rounded-md text-sm font-medium
                ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              Previous
            </button>
  
            <div className="flex items-center space-x-2">
              {[...Array(endPage - startPage + 1)].map((_, i) => (
                <button
                  key={i + startPage}
                  onClick={() => setPage(i + startPage)}
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium
                    ${page === i + startPage ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  {i + startPage}
                </button>
              ))}
            </div>
  
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`
                px-3 py-1 rounded-md text-sm font-medium
                ${page === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              Next
            </button>
          </nav>
        </div>
      )
    );
  };
  