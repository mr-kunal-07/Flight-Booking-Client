import { useState, useEffect, useCallback, useMemo } from "react";
import { Plane, Loader2, Clock, Users, Shield, Wifi, Eye, AlertCircle, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import FlightSearch from "./FlightSearch";
import Header from "./Header";

// ==================== TYPES ====================
interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    airlineLogo: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    price: string;
    availableSeats: number;
    totalSeats: number;
}

interface SearchParams {
    origin: string;
    destination: string;
    travelDate: string;
    passengers: number;
}

interface Pagination {
    page: number;
    pages: number;
    total: number;
}



// ==================== CONSTANTS ====================
const SEATS_LOW_THRESHOLD = 30;

const SORT_OPTIONS = [
    { value: "price", label: "Cheapest First" },
    { value: "time", label: "Earliest Departure" },
    { value: "duration", label: "Shortest Duration" }
] as const;

const BADGE_VARIANTS = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-orange-50 text-orange-700",
    info: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700"
} as const;

const BUTTON_VARIANTS = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 disabled:from-blue-400 disabled:to-blue-500",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 disabled:from-green-400 disabled:to-emerald-400",
    outline: "bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-700 disabled:border-gray-100 disabled:text-gray-400"
} as const;

// ==================== API SERVICE ====================
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const flightAPI = {
    getAll: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${apiUrl}/api/flights?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        if (!response.ok) throw new Error("Failed to fetch flights");
        return response.json();
    },

    search: async (params: SearchParams) => {
        const response = await fetch(`${apiUrl}/api/flights/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(params),
        });
        if (!response.ok) throw new Error("Failed to search flights");
        return response.json();
    },
};


// ==================== UTILITIES ====================
const formatTime = (datetime: string): string => {
    try {
        return new Date(datetime).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return "--:--";
    }
};

const formatDate = (datetime: string): string => {
    try {
        return new Date(datetime).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });
    } catch {
        return "Invalid Date";
    }
};

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const formatPrice = (price: string | number): string => {
    try {
        return parseFloat(String(price)).toLocaleString("en-IN");
    } catch {
        return "0";
    }
};

// ==================== REUSABLE COMPONENTS ====================
const Badge = ({
    icon: Icon,
    children,
    variant = "default"
}: {
    icon?: any;
    children: React.ReactNode;
    variant?: keyof typeof BADGE_VARIANTS;
}) => (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${BADGE_VARIANTS[variant]}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {children}
    </div>
);



const Button = ({
    children,
    variant = "primary",
    icon: Icon,
    loading,
    ...props
}: {
    children: React.ReactNode;
    variant?: keyof typeof BUTTON_VARIANTS;
    icon?: any;
    loading?: boolean;
    [key: string]: any;
}) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_VARIANTS[variant]} ${props.className || ''}`}
    >
        {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            Icon && <Icon className="w-4 h-4" />
        )}
        {children}
    </button>
);

// ==================== FLIGHT CARD ====================
const FlightCard = ({
    flight,
    onViewDetails
}: {
    flight: Flight;
    onViewDetails: (id: string) => void;
}) => {
    const seatPercent = (flight.availableSeats / flight.totalSeats) * 100;
    const isLowSeats = seatPercent < SEATS_LOW_THRESHOLD;
    const isSoldOut = flight.availableSeats === 0;

    return (
        <article
            className="
    bg-white rounded-2xl border border-gray-200
    hover:shadow-2xl hover:border-blue-300
    transition-all duration-300
    overflow-hidden group
  "
            aria-label={`Flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination}`}
        >
            {/* Status Bar */}
            {isSoldOut ? (
                <div className="bg-gray-800 text-white px-5 py-2 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Sold Out
                </div>
            ) : isLowSeats ? (
                <div className="bg-orange-50 text-orange-700 px-5 py-2 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Only {flight.availableSeats} seats left
                </div>
            ) : null}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <img
                                src={flight.airlineLogo}
                                alt={`${flight.airline} logo`}
                                className="w-8 h-8 object-contain scale-200"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        flight.airline
                                    )}&background=3b82f6&color=fff&size=64`;
                                }}
                            />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                {flight.airline}
                            </h3>
                            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            ₹{formatPrice(flight.price)}
                        </div>
                        <p className="text-xs text-gray-500">per traveller</p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <time className="text-2xl font-semibold text-gray-900">
                            {formatTime(flight.departureTime)}
                        </time>
                        <p className="text-sm font-medium text-gray-700">{flight.origin}</p>
                        <p className="text-xs text-gray-500">
                            {formatDate(flight.departureTime)}
                        </p>
                    </div>

                    <div className="flex flex-col items-center flex-1 px-4">
                        <span className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(flight.duration)}
                        </span>

                        <div className="relative w-full max-w-45">
                            <div className="h-0.5 bg-gray-300 rounded-full" />
                            <Plane className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-blue-500 rotate-90 bg-white px-1" />
                        </div>

                        <span className="mt-2 text-xs font-medium text-green-600">
                            Non-stop
                        </span>
                    </div>

                    <div className="text-right">
                        <time className="text-2xl font-semibold text-gray-900">
                            {formatTime(flight.arrivalTime)}
                        </time>
                        <p className="text-sm font-medium text-gray-700">{flight.destination}</p>
                        <p className="text-xs text-gray-500">
                            {formatDate(flight.arrivalTime)}
                        </p>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge icon={Users} >
                        {flight.availableSeats} seats
                    </Badge>
                    <Badge icon={Shield} >
                        Refundable
                    </Badge>
                    <Badge icon={Wifi} >
                        Wi-Fi
                    </Badge>
                </div >

                {/* Action */}
                <Button
                    icon={Eye}
                    onClick={() => onViewDetails(flight.id)}
                    className="w-full rounded-xl"
                >
                    View Details
                </Button>

            </div >
        </article >

    );
};


// ==================== PAGINATION ====================
const PaginationControls = ({
    pagination,
    onPageChange,
    loading
}: {
    pagination: Pagination;
    onPageChange: (page: number) => void;
    loading: boolean;
}) => {
    if (pagination.pages <= 1) return null;

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                Previous
            </button>

            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                {pagination.page}
            </span>

            <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                Next
            </button>
        </nav>
    );
};

// ==================== MAIN COMPONENT ====================
const Home = () => {
    const navigate = useNavigate();
    const user = getUser();

    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("price");
    const [searchMode, setSearchMode] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pages: 1,
        total: 0
    });
    const [searchParams, setSearchParams] = useState<SearchParams>({
        origin: "",
        destination: "",
        travelDate: new Date().toISOString().split("T")[0],
        passengers: 1
    });

    // Fetch all flights
    const fetchAllFlights = useCallback(async (page = 1) => {
        setLoading(true);
        setError("");

        try {
            const data = await flightAPI.getAll(page, 10);
            setFlights(data.data || []);
            setPagination(data.pagination);
            setSearchMode(false);
        } catch (err) {
            setError("Failed to load flights. Please try again.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search flights
    const searchFlights = useCallback(
        async (overrideParams?: SearchParams) => {
            const finalParams = overrideParams || searchParams;

            const errors: Record<string, string> = {};
            if (!finalParams.origin.trim()) errors.origin = "Origin is required";
            if (!finalParams.destination.trim()) errors.destination = "Destination is required";
            if (!finalParams.travelDate) errors.travelDate = "Date is required";

            setFormErrors(errors);
            if (Object.keys(errors).length > 0) return;

            setLoading(true);
            setError("");

            try {
                const data = await flightAPI.search(finalParams);
                setFlights(data.data || []);
                setPagination({
                    page: 1,
                    pages: 1,
                    total: data.data?.length || 0
                });
                setSearchMode(true);
            } catch {
                setError("No flights found");
            } finally {
                setLoading(false);
            }
        },
        [searchParams]
    );


    // Initial load
    useEffect(() => {
        fetchAllFlights();
    }, [fetchAllFlights]);

    // Handlers
    const handleLogout = useCallback(() => {
        logout();
        navigate("/login");
    }, [navigate]);

    const handleViewDetails = useCallback((id: string) => {
        navigate(`/flight/${id}`);
    }, [navigate]);

    const handlePageChange = useCallback((page: number) => {
        fetchAllFlights(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchAllFlights]);

    const handleResetSearch = useCallback(() => {
        setSearchParams({
            origin: "",
            destination: "",
            travelDate: new Date().toISOString().split("T")[0],
            passengers: 1
        });
        setFormErrors({});
        fetchAllFlights();
    }, [fetchAllFlights]);

    // Sorted flights
    const sortedFlights = useMemo(() => {
        return [...flights].sort((a, b) => {
            switch (sortBy) {
                case "price":
                    return parseFloat(a.price) - parseFloat(b.price);
                case "time":
                    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
                case "duration":
                    return a.duration - b.duration;
                default:
                    return 0;
            }
        });
    }, [flights, sortBy]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <Header
                user={user}
                onLogout={handleLogout}
                onMyBookings={() => navigate("/my-bookings")}
            />

            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-12">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <FlightSearch onSearch={searchFlights} />
                </div>
            </section>


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {searchMode ? 'Search Results' : 'Available Flights'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {pagination.total} flights • Page {pagination.page} of {pagination.pages}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {searchMode && (
                            <Button
                                variant="outline"
                                icon={RefreshCw}
                                onClick={handleResetSearch}
                                className="text-sm"
                            >
                                <span className="hidden sm:inline">Reset</span>
                            </Button>
                        )}
                        <SlidersHorizontal className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            aria-label="Sort flights"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3" role="alert">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Searching for best flights...</p>
                    </div>
                )}

                {/* Flight List */}
                {!loading && sortedFlights.length > 0 && (
                    <>
                        <div className="grid gap-4 lg:gap-6">
                            {sortedFlights.map((flight) => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>

                        <PaginationControls
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    </>
                )}

                {/* Empty State */}
                {!loading && sortedFlights.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plane className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchMode
                                ? "Try adjusting your search criteria"
                                : "No flights available at the moment"}
                        </p>
                        {searchMode ? (
                            <Button icon={RefreshCw} onClick={handleResetSearch}>
                                View All Flights
                            </Button>
                        ) : (
                            <Button icon={RefreshCw} onClick={() => fetchAllFlights()}>
                                Refresh
                            </Button>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">© 2024 FlightBook. All rights reserved.</p>
                        <p className="text-xs text-gray-500 mt-2">
                            Need help? Contact <a href="mailto:support@flightbook.com" className="text-blue-600 hover:underline">support@flightbook.com</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
