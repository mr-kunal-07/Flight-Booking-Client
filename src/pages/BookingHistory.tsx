import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plane,
    Users,
    Clock,
    MapPin,
    ArrowRight,
    Loader2,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    Download
} from "lucide-react";

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

const BookingHistory = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled">("all");

    useEffect(() => {
        fetchBookings();
    }, []);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/bookings/user/history`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });


            const data = await response.json();

            if (response.ok) {
                setBookings(data.data || []);
            } else {
                setError(data.message || "Failed to fetch bookings");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case "CONFIRMED":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "CANCELLED":
                return <XCircle className="w-5 h-5 text-red-600" />;
            case "PENDING":
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        My Bookings
                    </h1>
                    <p className="text-gray-600">View and manage all your flight bookings</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all ${filter === "all"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        onClick={() => setFilter("confirmed")}
                        className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all ${filter === "confirmed"
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        Confirmed ({bookings.filter((b) => b.status.toLowerCase() === "confirmed").length})
                    </button>
                    <button
                        onClick={() => setFilter("cancelled")}
                        className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all ${filter === "cancelled"
                            ? "bg-red-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        Cancelled ({bookings.filter((b) => b.status.toLowerCase() === "cancelled").length})
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 font-medium">{error}</p>
                    </div>
                )}

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-600 mb-6">
                            {filter === "all"
                                ? "You haven't made any bookings yet."
                                : `No ${filter} bookings found.`}
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Search Flights
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-4 sm:p-6">
                                    {/* Booking Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                                <Plane className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-gray-900">
                                                    {booking.bookingReference}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Booked on {formatDate(booking.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full border font-semibold text-sm flex items-center gap-2 w-fit ${getStatusColor(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status}
                                        </div>
                                    </div>

                                    {/* Flight Details */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                                        {/* Airline */}
                                        <div className="lg:col-span-3 flex items-center gap-3">
                                            <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shrink-0">
                                                <img
                                                    src={booking.flight.airlineLogo}
                                                    alt={booking.flight.airline}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{booking.flight.airline}</div>
                                                <div className="text-sm text-gray-600">{booking.flight.flightNumber}</div>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="lg:col-span-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <div className="font-bold text-xl text-gray-900">
                                                            {booking.flight.origin}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatTime(booking.flight.departureTime)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(booking.flight.departureTime)}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center px-2">
                                                    <Clock className="w-4 h-4 text-gray-400 mb-1" />
                                                    <ArrowRight className="w-8 h-8 text-blue-600" />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {booking.flight.duration}h
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-right">
                                                    <div className="flex items-center justify-end gap-2 mb-1">
                                                        <div className="font-bold text-xl text-gray-900">
                                                            {booking.flight.destination}
                                                        </div>
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatTime(booking.flight.arrivalTime)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(booking.flight.arrivalTime)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-center">
                                            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                ₹{parseFloat(booking.totalAmount).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-5 h-5 text-gray-600" />
                                            <span className="font-semibold text-gray-900">
                                                Passengers ({booking.numberOfPassengers})
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {booking.passengers.map((passenger) => (
                                                <div
                                                    key={passenger.id}
                                                    className="bg-white rounded-lg px-3 py-2 border border-gray-200"
                                                >
                                                    <div className="font-medium text-gray-900">
                                                        {passenger.firstName} {passenger.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {passenger.gender} • {passenger.age} years
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => navigate(`/booking/${booking.id}`)}
                                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            View Details
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
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