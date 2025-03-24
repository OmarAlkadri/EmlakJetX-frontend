/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Option {
    label: string;
    name: string;
    value?: boolean;
}

interface FilterProps {
    title: string;
    width?: string;
    height?: string;
    options: Option[];
    onSubmit: (value: any, customValue?: any) => void;
    selectedOption: Option[] | undefined;
    enableCustomField?: boolean;
    type: 'radio' | 'checkbox';
    additionalFields?: boolean;
}

const UnifiedInputComponent: React.FC<FilterProps> = ({
    title,
    width = 'w-72',
    height = 'max-h-48',
    onSubmit,
    selectedOption,
    enableCustomField = false,
    type,
    additionalFields = false
}) => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(new Date().setDate(new Date().getDate() - 10)),
        new Date()
    ]);
    const [startDate, endDate] = dateRange;

    const [country, setCountry] = useState("");
    const [rooms, setRooms] = useState<number | string>(""); // Fixed type inference
    const [priceMin, setPriceMin] = useState<number | string>(""); // Fixed type inference
    const [priceMax, setPriceMax] = useState<number | string>(""); // Fixed type inference

    const handleDateChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
        onSubmit(selectedOption?.[0], update);
    };

    const handleAdditionalFilters = () => {
        const filters = {
            startDate,
            endDate,
            country,
            rooms,
            priceMin,
            priceMax
        };
        onSubmit(filters); // Apply custom filters
    };

    return (
        <div className={`flex flex-col p-2 ${width} ${height}`}>
            <div className="font-[Eudoxus_Sans] text-[16px] font-bold leading-[20.16px] pb-2">{title}</div>

            {enableCustomField && type === 'radio' && (
                <div className="flex items-center mt-4 w-full customDatePickerWidth">
                    <DatePicker
                        className="w-full h-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none"
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        isClearable
                    />
                </div>
            )}

            {additionalFields && (
                <div className="mt-4">
                    <input
                        type="text"
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <input
                        type="number"
                        className="w-full p-2 text-sm border border-gray-300 rounded-md mt-2"
                        placeholder="Number of Rooms"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                        <input
                            type="number"
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            placeholder="Min Price"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <input
                            type="number"
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            placeholder="Max Price"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md"
                        onClick={handleAdditionalFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
};


export default UnifiedInputComponent;
