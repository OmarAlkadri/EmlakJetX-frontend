import React from "react";
import { Pagination } from "./Pagination";

type FilterBarProps = {
    currentPage: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
};

export const FilterBar: React.FC<FilterBarProps> = ({
    currentPage,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
}) => {
    return (
        <div className="flex items-center justify-between p-4 text-gray-700">
            <label className="text-sm">
                Rows per page:
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="ml-2"
                >
                    {[5, 10, 15].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </label>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};
