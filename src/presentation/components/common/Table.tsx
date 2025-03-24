"use client";
import React, { useState, useMemo, JSX } from "react";
import { FilterBar } from "./FilterBar";

type TableProps<T extends { _id: string | number }> = {
    data: T[];
    visibleColumns?: string[];
    dateColumns: string[];
    enableFilterBar: boolean;
    enableCheckbox: boolean;
    enableActions: boolean;
    enableAppBar?: JSX.Element;
    ActionsData?: (props: { item: T }) => JSX.Element;
    paginationControls?: {
        currentPage: number;
        rowsPerPage: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onRowsPerPageChange: (rows: number) => void;
    };
};

export const Table = <T extends { _id: string | number }>({
    data,
    visibleColumns = [],
    dateColumns,
    enableFilterBar,
    enableCheckbox,
    enableActions,
    enableAppBar,
    ActionsData,
    paginationControls,
}: TableProps<T>) => {
    const [internalPage, setInternalPage] = useState(1);
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(5);

    const currentPage = paginationControls?.currentPage ?? internalPage;
    const rowsPerPage = paginationControls?.rowsPerPage ?? internalRowsPerPage;
    const handlePageChange = paginationControls?.onPageChange ?? setInternalPage;
    const handleRowsPerPageChange = paginationControls?.onRowsPerPageChange ?? setInternalRowsPerPage;

    const totalItems = paginationControls?.totalItems ?? data.length;
    // const totalPages = useMemo(() => Math.ceil(totalItems / rowsPerPage), [totalItems, rowsPerPage]);

    const currentRows = useMemo(() => {
        //const start = (currentPage - 1) * rowsPerPage;
        //const end = start + rowsPerPage;
        return data.slice(0, rowsPerPage);
    }, [currentPage, rowsPerPage, data]);

    const formatDateTime = (value: string): string => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return `${date.toISOString().split("T")[0]} ${date.toTimeString().split(" ")[0]}`;
    };

    return (

        <div className="min-w-32 max-w-full max-h-[700px] min-h-32 h-auto relative column-scroll-style shadow-md shadow-gray-800 dark:shadow-white overflow-auto">
            {enableAppBar && <div className="min-w-full mb-4">{enableAppBar}</div>}

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {enableCheckbox && <th className="w-4 p-4"><input type="checkbox" /></th>}
                        {visibleColumns.map((col) => (
                            <th key={col} className="px-6 py-3">{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
                        ))}
                        {enableActions && <th className="px-6 py-3">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((item) => (
                        <tr key={item._id}>
                            {enableCheckbox && <td className="w-4 p-4"><input type="checkbox" /></td>}
                            {visibleColumns.map((col) => (
                                <td key={col} className="px-6 py-4">
                                    {dateColumns.includes(col) && typeof item[col as keyof T] === "string"
                                        ? formatDateTime(item[col as keyof T] as string)
                                        : String(item[col as keyof T] ?? "")}
                                </td>
                            ))}
                            {enableActions && ActionsData && (
                                <td className="px-6 py-4">{ActionsData({ item })}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {enableFilterBar && (
                <FilterBar
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            )}
        </div>
    );
};
