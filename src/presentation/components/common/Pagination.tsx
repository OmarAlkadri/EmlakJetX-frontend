import React from "react";

type PaginationProps = {
    currentPage: number;
    totalItems: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    rowsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages > 0) {
            pages.push(1);
        }

        if (currentPage > 3) {
            pages.push("...");
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };


    return (
        <div className="flex gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
                Previous
            </button>
            {generatePageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    disabled={typeof page !== "number"}
                >
                    {page}
                </button>
            ))}
            <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};
