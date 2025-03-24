/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { DELETE_LISTING, PAGINATED_LISTINGS } from "@/application/graphql/queries";
import { useRouter } from "next/navigation";
import { Listing, Review } from "@/utils/types";
import { Table } from "@/presentation/components/common/Table";
import Loader from "@/presentation/components/common/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import Dialog from "@/presentation/components/common/Dialog";
import ReviewsPage from "@/presentation/components/common/ReviewsPage";
import { useAuth } from "@/contexts/AuthContext";

const EmployeeDashboardPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    const [filters, setFilters] = useState({
        city: "",
        rooms: undefined as number | undefined,
        priceMin: undefined as number | undefined,
        priceMax: undefined as number | undefined,
        dateRange: [null, null] as [Date | null, Date | null],
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        rowsPerPage: 10,
    });

    const [listings, setListings] = useState<Listing[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState<Review[] | undefined>();

    const [fetchListings, { data, networkStatus }] = useLazyQuery(PAGINATED_LISTINGS, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
    });

    const [deleteListing] = useMutation(DELETE_LISTING, {
        onCompleted: () => {
            toast.info("Silme işlemi tamamlandı!", { position: "top-right", autoClose: 5000, theme: "light", transition: Bounce });
            fetchFilteredListings();
        },
        onError: (err) => console.error(err.message),
    });

    const fetchFilteredListings = useCallback(() => {
        const { city, rooms, priceMin, priceMax, dateRange } = filters;
        const [startDate, endDate] = dateRange;

        const variables: Record<string, any> = {
            page: pagination.currentPage,
            limit: pagination.rowsPerPage,
            userId: user?._id
        };

        if (city) variables.city = city;
        if (rooms) variables.rooms = rooms;
        if (typeof priceMin === "number") variables.priceMin = priceMin;
        if (typeof priceMax === "number") variables.priceMax = priceMax;
        if (startDate) variables.startDate = startDate.toISOString();
        if (endDate) variables.endDate = endDate.toISOString();

        fetchListings({ variables });
    }, [filters, pagination, fetchListings]);

    useEffect(() => {
        fetchFilteredListings();
    }, [pagination]);

    useEffect(() => {
        if (data) {
            setListings(data.paginatedListings.listings);
            setTotalRecords(data.paginatedListings.totalCount);
        }
    }, [data]);

    const handleDeleteItem = (listing: Listing) => {
        Swal.fire({
            title: "Emin misiniz?",
            text: `"${listing.title}" silinecek ve geri alınamaz!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "İptal"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteListing({ variables: { id: listing._id } });
                Swal.fire({
                    title: "Silindi!",
                    text: "Öğe başarıyla silindi.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleInputChange = (field: keyof typeof filters, value: string | number | [Date | null, Date | null]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenDialog = (reviews: Review[]) => {
        setSelectedReviews(reviews);
        setDialogOpen(true);
    };

    const ActionsTemplate = useCallback(({ item }: { item: Listing }) => (
        <div className="flex gap-2">
            <button onClick={() => handleOpenDialog(item.reviews)}>
                <Icon icon="material-symbols-light:details" width="24" height="24" />
            </button>
            <button onClick={() => router.push(`/dashboard/ListingForm?id=${item._id}`)}>
                <Icon icon="material-symbols-light:edit-note-outline" width="24" height="24" />
            </button>
        </div>
    ), []);

    const visibleColumns = useMemo(() => ['_id', 'title', 'price', 'city', 'district', 'rooms', 'area', 'averageRating'], []);



    const handleFilterClick = useCallback(() => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchFilteredListings();
    }, [fetchFilteredListings]);


    const handleNewListing = () => {
        router.push('/dashboard/ListingForm')
    };




    return (
        <Loader loaded={networkStatus !== 1} onlySpinner={false}>

            <div className="">
                {dialogOpen && selectedReviews && (
                    <Dialog
                        position={{ content: 'center', items: 'start' }}
                        templete={<ReviewsPage data={selectedReviews} />}
                        onClose={() => setDialogOpen(false)}
                        width="md"
                        height="xl"
                    />
                )}

                <div className="">
                    <div>
                        <div className="flex justify-center items-center bg-gray-100 rounded-lg shadow-md">
                            <div className="p-2 ">
                                <button onClick={handleNewListing} className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <Icon icon="material-symbols-light:create-new-folder-rounded" width="18" height="18" />
                                    Yeni İlan
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-4 p-4  ">
                                <input type="text" placeholder="Şehir" value={filters.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)} className="border rounded px-3 py-2" />

                                <input type="number" placeholder="Oda Sayısı" value={filters.rooms ?? ""}
                                    onChange={(e) => handleInputChange("rooms", Number(e.target.value))} className="border rounded px-3 py-2" />

                                <input type="number" placeholder="Min Fiyat" value={filters.priceMin ?? ""}
                                    onChange={(e) => handleInputChange("priceMin", Number(e.target.value))} className="border rounded px-3 py-2"
                                />

                                <input type="number" placeholder="Max Fiyat" value={filters.priceMax ?? ""}
                                    onChange={(e) => handleInputChange("priceMax", Number(e.target.value))} className="border rounded px-3 py-2"
                                />
                                <DatePicker selectsRange startDate={filters.dateRange[0]} endDate={filters.dateRange[1]} onChange={(update) => handleInputChange("dateRange", update)} className="border rounded px-3 py-2" isClearable placeholderText="Bir zaman aralığı tanımlayın" />
                                <button onClick={handleFilterClick} className="bg-blue-500 text-white px-4 py-2 rounded">Filtrelerin uygulanması</button>
                            </div>
                        </div>
                    </div>

                    <Table
                        data={listings}
                        visibleColumns={visibleColumns}
                        enableFilterBar
                        enableActions
                        ActionsData={ActionsTemplate}
                        paginationControls={{
                            currentPage: pagination.currentPage,
                            rowsPerPage: pagination.rowsPerPage,
                            totalItems: totalRecords,
                            onPageChange: (page) => setPagination(prev => ({ ...prev, currentPage: page })),
                            onRowsPerPageChange: (rows) => setPagination(prev => ({ ...prev, rowsPerPage: rows })),
                        }}
                        dateColumns={visibleColumns}
                        enableCheckbox={false}
                    />
                </div>
            </div>
        </Loader>
    );
};

export default EmployeeDashboardPage;
