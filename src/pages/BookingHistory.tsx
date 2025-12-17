import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Passenger {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
}

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
}

interface Booking {
    id: string;
    bookingReference: string;
    status: string;
    totalAmount: string;
    numberOfPassengers: number;
    bookingDate: string;
    createdAt: string;
    flight: Flight;
    passengers: Passenger[];
}

interface ApiResponse {
    success: boolean;
    data: Booking[];
    message?: string;
}

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled">("all");

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${apiUrl}/api/bookings/user/history`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data: ApiResponse = await response.json();

            if (data.success) {
                setBookings(data.data || []);
            } else {
                setError(data.message || "Failed to load bookings");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Network error occurred";
            console.error("Error fetching bookings:", err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return dateString;
        }
    };

    const formatDuration = (minutes: number | string) => {
        const mins = typeof minutes === "string" ? parseInt(minutes) : minutes;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const getStatusIcon = (status: string) => {
        const statusUpper = status.toUpperCase();
        switch (statusUpper) {
            case "CONFIRMED":
                return "✓";
            case "CANCELLED":
                return "✕";
            case "PENDING":
                return "!";
            default:
                return "📄";
        }
    };

    const getStatusColor = (status: string) => {
        const statusUpper = status.toUpperCase();
        switch (statusUpper) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800 border-green-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        return booking.status.toLowerCase() === filter;
    });

    const confirmedCount = bookings.filter((b) => b.status.toLowerCase() === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.status.toLowerCase() === "cancelled").length;

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-300">
                        <ArrowLeft
                            onClick={() => navigate(-1)}
                            className="w-6 h-6 text-gray-600 cursor-pointer"
                        />
                        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 ">
                            My Bookings
                        </h1>
                    </div>
                </div>

                {/* Filter Tabs - Responsive */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 sm:px-6 py-2 rounded-md font-semibold transition-all text-sm sm:text-base min-h-11 flex items-center ${filter === "all"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        onClick={() => setFilter("confirmed")}
                        className={`px-3 sm:px-6 py-2 rounded-md font-semibold transition-all text-sm sm:text-base min-h-11 flex items-center ${filter === "confirmed"
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        Confirmed ({confirmedCount})
                    </button>
                    <button
                        onClick={() => setFilter("cancelled")}
                        className={`px-3 sm:px-6 py-2 rounded-md font-semibold transition-all text-sm sm:text-base min-h-11 flex items-center ${filter === "cancelled"
                            ? "bg-red-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        Cancelled ({cancelledCount})
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 text-lg">⚠️</span>
                            <p className="text-xs sm:text-sm text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
                        <div className="text-4xl mb-4">📄</div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            No bookings found
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-6">
                            {filter === "all"
                                ? "You haven't made any bookings yet."
                                : `No ${filter} bookings found.`}
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="bg-blue-600 text-white px-6 py-3 min-h-11 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            Search Flights
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg sm:rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-3 sm:p-4 lg:p-6">
                                    {/* Booking Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                                <span className="text-white text-lg sm:text-xl">✈️</span>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm sm:text-lg text-gray-900 truncate">
                                                    {booking.bookingReference}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-600">
                                                    Booked on {formatDate(booking.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`px-3 sm:px-4 py-2 rounded-full border font-semibold text-xs sm:text-sm flex items-center gap-2 shrink-0 ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            <span className="text-base">{getStatusIcon(booking.status)}</span>
                                            {booking.status}
                                        </div>
                                    </div>

                                    {/* Flight Details - Responsive Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-100">
                                        {/* Airline */}
                                        <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-2 sm:gap-3">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center p-2 shrink-0">
                                                <img
                                                    src={booking.flight.airlineLogo}
                                                    alt={booking.flight.airline}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://via.placeholder.com/50?text=Airline";
                                                    }}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm sm:text-base text-gray-900 truncate">
                                                    {booking.flight.airline}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {booking.flight.flightNumber}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="sm:col-span-2 lg:col-span-6">
                                            <div className="flex items-center gap-1 sm:gap-3">
                                                {/* Departure */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                                                        <span className="text-gray-400 text-xs hidden sm:inline">📍</span>
                                                        <div className="font-bold text-lg sm:text-xl text-gray-900">
                                                            {booking.flight.origin}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {formatTime(booking.flight.departureTime)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(booking.flight.departureTime)}
                                                    </div>
                                                </div>

                                                {/* Duration */}
                                                <div className="flex flex-col items-center px-1 sm:px-2">
                                                    <span className="text-gray-400 text-xs hidden sm:inline">⏱️</span>
                                                    <span className="text-blue-600 text-sm sm:text-lg">→</span>
                                                    <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                                        {formatDuration(booking.flight.duration)}
                                                    </div>
                                                </div>

                                                {/* Arrival */}
                                                <div className="flex-1 text-right min-w-0">
                                                    <div className="flex items-center justify-end gap-1 mb-0.5 sm:mb-1">
                                                        <div className="font-bold text-lg sm:text-xl text-gray-900">
                                                            {booking.flight.destination}
                                                        </div>
                                                        <span className="text-gray-400 text-xs hidden sm:inline">📍</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {formatTime(booking.flight.arrivalTime)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(booking.flight.arrivalTime)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start sm:items-end justify-center">
                                            <div className="text-xs text-gray-600 mb-1">Total Amount</div>
                                            <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                                ₹{parseFloat(booking.totalAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">👥</span>
                                            <span className="font-semibold text-sm sm:text-base text-gray-900">
                                                Passengers ({booking.numberOfPassengers})
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {booking.passengers.map((passenger) => (
                                                <div
                                                    key={passenger.id}
                                                    className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {passenger.firstName} {passenger.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {passenger.gender} • {passenger.age} years
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <button
                                            onClick={() => navigate(`/booking/${booking.id}`)}
                                            className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-11"
                                        >
                                            View Details
                                            <span>→</span>
                                        </button>
                                        <button
                                            className="sm:flex-1 lg:flex-none bg-white text-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-11"
                                            aria-label="Download booking details"
                                        >
                                            <span>⬇️</span>
                                            <span className="hidden sm:inline">Download</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;