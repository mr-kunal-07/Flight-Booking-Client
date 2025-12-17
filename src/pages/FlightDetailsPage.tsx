import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface FlightDetails {
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

interface ApiResponse {
    success: boolean;
    data: FlightDetails;
    message?: string;
}


const FlightDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [flight, setFlight] = useState<FlightDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [passengers, setPassengers] = useState(1);
    const [showPricingSheet, setShowPricingSheet] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Fetch flight details on mount
    useEffect(() => {
        fetchFlightDetails();
    }, [id]);

    const fetchFlightDetails = async () => {
        if (!id) {
            setError("Flight ID not provided");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(`${apiUrl}/api/flights/${id}`, {
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

            if (data.success && data.data) {
                setFlight(data.data);
            } else {
                setError(data.message || "Failed to load flight details");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            console.error("Error fetching flight:", err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = () => {
        if (!flight) return;

        try {
            setIsBooking(true);


            // Navigate to booking confirmation page with flight details
            navigate(`/booking-confirmation?flightId=${flight.id}&adults=${passengers}`, {
                state: {
                    flightDetails: flight,
                    passengers: passengers,
                    totalPrice: parseFloat(flight.price) * passengers
                },
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Navigation failed";
            console.error("Booking navigation error:", err);
            setError(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    const formatTime = (datetime: string) => {
        try {
            return new Date(datetime).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return datetime;
        }
    };

    const formatDate = (datetime: string) => {
        try {
            return new Date(datetime).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
            });
        } catch {
            return datetime;
        }
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading flight details...</p>
                </div>
            </div>
        );
    }

    // Error State - Invalid Flight ID
    if (error && !flight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-sm">
                    <div className="text-4xl mb-4">❌</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {error === "Flight ID not provided" ? "Invalid Flight" : "Error"}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 min-h-11 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Flight Not Found
    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center max-w-sm">
                    <div className="text-4xl mb-4">✈️</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Flight not found
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                        The flight you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-3 min-h-11 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = parseFloat(flight.price) * passengers;
    const seatPercentage = (flight.availableSeats / flight.totalSeats) * 100;
    const isLowSeats = seatPercentage < 30;
    const basePrice = parseFloat(flight.price);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
            {/* Header */}
            <header className="bg-linear-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-blue-800 rounded-lg transition-colors min-w-11 min-h-11 flex items-center justify-center"
                            aria-label="Go back"
                            title="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-base sm:text-lg lg:text-xl font-bold truncate">
                                Complete your booking
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-200 hidden sm:block">
                                {flight.origin} → {flight.destination}
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 text-sm text-blue-200">
                            <span>Trip Summary</span>
                            <span>•</span>
                            <span>Travel Info</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 px-3 sm:px-4 py-3 sticky top-16 z-30">
                    <div className="max-w-6xl mx-auto flex items-center gap-3">
                        <span className="text-red-600 text-lg shrink-0">⚠️</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-red-800 font-medium">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm shrink-0 min-h-11 px-2 flex items-center"
                            aria-label="Close error message"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full px-3 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        {/* Flight Info Card */}
                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Route Header */}
                            <div className="bg-linear-to-r from-green-50 to-blue-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                                            {flight.origin} → {flight.destination}
                                        </h2>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-600">
                                            <span>{formatDate(flight.departureTime)}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>Non Stop • {formatDuration(flight.duration)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded text-xs font-bold inline-block whitespace-nowrap">
                                            FEES APPLY
                                        </div>
                                        <button
                                            className="text-blue-600 text-xs sm:text-sm mt-1 hover:underline block min-h-11 items-center justify-end w-full"
                                            aria-label="View cancellation rules"
                                        >
                                            View Rules
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Details */}
                            <div className="p-3 sm:p-6">
                                <div className="flex gap-3 sm:gap-4">
                                    {/* Airline Logo */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 shrink-0">
                                        <img
                                            src={flight.airlineLogo}
                                            alt={flight.airline}
                                            className="w-full h-full object-contain"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/50?text=Airline";
                                            }}
                                        />
                                    </div>

                                    {/* Flight Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-sm sm:text-base text-gray-900">
                                                {flight.airline}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-600">
                                                {flight.flightNumber}
                                            </span>
                                        </div>
                                        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs inline-block mb-3 sm:mb-6">
                                            Economy • SAVER
                                        </div>

                                        {/* Route - Responsive Layout */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
                                            {/* Departure */}
                                            <div className="min-w-0">
                                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                    {formatTime(flight.departureTime)}
                                                </div>
                                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">
                                                    {flight.origin}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                    IGI Airport, T1
                                                </div>
                                            </div>

                                            {/* Duration Line */}
                                            <div className="hidden sm:flex flex-1 flex-col items-center px-2 lg:px-4">
                                                <div className="text-xs text-gray-500 mb-2">
                                                    {formatDuration(flight.duration)}
                                                </div>
                                                <div className="w-full h-px bg-gray-300 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Duration Badge for Mobile */}
                                            <div className="sm:hidden flex justify-center">
                                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {formatDuration(flight.duration)}
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div className="min-w-0">
                                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                    {formatTime(flight.arrivalTime)}
                                                </div>
                                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">
                                                    {flight.destination}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                    BLR Airport, T1
                                                </div>
                                            </div>
                                        </div>

                                        {/* Baggage Info - Responsive */}
                                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-8 text-xs sm:text-sm">
                                            <div className="flex gap-2">
                                                <span className="text-orange-600 shrink-0 mt-0.5 text-lg">🧳</span>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-700">Cabin:</div>
                                                    <div className="text-gray-600 text-xs">7 Kgs / Adult</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-orange-600 shrink-0 mt-0.5 text-lg">🧳</span>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-700">Check-In:</div>
                                                    <div className="text-gray-600 text-xs">15 Kgs / Adult</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extra Baggage */}
                                        <div className="mt-3 sm:mt-4 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                            <span className="text-blue-600 shrink-0 hidden sm:block text-lg">🧳</span>
                                            <div className="text-xs sm:text-sm text-gray-700">
                                                Buy extra baggage at great rates!
                                            </div>
                                            <button
                                                className="text-blue-600 font-semibold text-xs sm:text-sm whitespace-nowrap px-3 py-2 sm:py-0 sm:ml-auto min-h-11 sm:min-h-auto hover:bg-blue-100 rounded transition-colors"
                                                aria-label="Add baggage"
                                            >
                                                ADD
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-3 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    Cancellation Policy
                                </h3>
                                <button
                                    className="text-blue-600 text-xs sm:text-sm hover:underline min-h-11 px-2 flex items-center"
                                    aria-label="View full policy"
                                >
                                    View
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-lg">
                                    ✈️
                                </div>
                                <div className="text-xs sm:text-sm font-semibold text-gray-700">
                                    {flight.origin}-{flight.destination}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    Cancellation Penalty:
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-3 sm:mb-4">
                                    <div className="absolute left-0 top-0 h-full bg-linear-to-r from-green-500 via-yellow-500 to-red-500 w-full"></div>
                                </div>

                                {/* Time Slots - Responsive Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div className="text-center p-2 sm:p-0">
                                        <div className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">
                                            Now
                                        </div>
                                        <div className="text-green-600 font-semibold text-xs">₹4,349</div>
                                    </div>
                                    <div className="text-center p-2 sm:p-0">
                                        <div className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">
                                            18 Dec
                                        </div>
                                        <div className="text-gray-600 text-xs">05:30</div>
                                        <div className="text-yellow-600 font-semibold text-xs mt-1">
                                            ₹5,349
                                        </div>
                                    </div>
                                    <div className="text-center p-2 sm:p-0">
                                        <div className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">
                                            19 Dec
                                        </div>
                                        <div className="text-gray-600 text-xs">02:30</div>
                                        <div className="text-orange-600 font-semibold text-xs mt-1">
                                            ₹7,537
                                        </div>
                                    </div>
                                    <div className="text-center p-2 sm:p-0">
                                        <div className="font-bold text-gray-900 mb-1 text-xs sm:text-sm">
                                            19 Dec
                                        </div>
                                        <div className="text-gray-600 text-xs">05:30</div>
                                        <div className="text-red-600 font-semibold text-xs mt-1">
                                            ₹0
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 mt-3 sm:mt-4">
                                    <span className="font-semibold">Now - 18 Dec 05:30 (IST)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                            <PricingSummary
                                flight={flight}
                                passengers={passengers}
                                totalPrice={totalPrice}
                                basePrice={basePrice}
                                isLowSeats={isLowSeats}
                                setPassengers={setPassengers}
                                onBook={handleBooking}
                                isBooking={isBooking}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
                <button
                    onClick={() => setShowPricingSheet(!showPricingSheet)}
                    className="w-full px-4 py-3 flex items-center justify-between min-h-15"
                    aria-label="Toggle pricing details"
                >
                    <div className="text-left">
                        <div className="text-xs text-gray-600">Total</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            ₹{totalPrice.toLocaleString("en-IN")}
                        </div>
                    </div>
                    <div className="text-gray-600 text-2xl">
                        {showPricingSheet ? "▼" : "▲"}
                    </div>
                </button>

                {/* Expanded Pricing Sheet */}
                {showPricingSheet && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
                        <PricingSummary
                            flight={flight}
                            passengers={passengers}
                            totalPrice={totalPrice}
                            basePrice={basePrice}
                            isLowSeats={isLowSeats}
                            setPassengers={setPassengers}
                            onBook={handleBooking}
                            isBooking={isBooking}
                            isMobile={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

interface PricingSummaryProps {
    flight: FlightDetails;
    passengers: number;
    totalPrice: number;
    basePrice: number;
    isLowSeats: boolean;
    setPassengers: (n: number) => void;
    onBook: () => void;
    isBooking: boolean;
    isMobile?: boolean;
}

const PricingSummary = ({
    flight,
    passengers,
    totalPrice,
    basePrice,
    isLowSeats,
    setPassengers,
    onBook,
    isBooking,
}: PricingSummaryProps) => (
    <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Fare Summary</h3>

        {/* Passengers */}
        <div className="mb-4">
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                Passengers
            </label>
            <div className="flex items-center gap-3 justify-center">
                <button
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    disabled={isBooking || passengers <= 1}
                    className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease passengers"
                >
                    −
                </button>
                <div className="flex-1 text-center max-w-15">
                    <div className="text-2xl sm:text-xl font-bold text-gray-900">
                        {passengers}
                    </div>
                    <div className="text-xs text-gray-500">Pax</div>
                </div>
                <button
                    onClick={() =>
                        setPassengers(Math.min(flight.availableSeats, passengers + 1))
                    }
                    disabled={passengers >= flight.availableSeats || isBooking}
                    className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase passengers"
                >
                    +
                </button>
            </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 py-4 border-t border-b border-gray-200">
            <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Base Fare × {passengers}</span>
                <span className="font-semibold text-gray-900">
                    ₹{(basePrice * passengers).toLocaleString("en-IN")}
                </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold text-gray-900">₹0</span>
            </div>
        </div>

        {/* Total */}
        <div className="py-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                    Total Amount
                </span>
                <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        ₹{totalPrice.toLocaleString("en-IN")}
                    </div>
                </div>
            </div>

            {/* Seats Warning */}
            {isLowSeats && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="text-orange-600 shrink-0 text-lg">⚠️</span>
                        <span className="font-semibold text-orange-800">
                            Only {flight.availableSeats} seats left!
                        </span>
                    </div>
                </div>
            )}

            {/* Book Button */}
            <button
                onClick={onBook}
                disabled={flight.availableSeats === 0 || isBooking}
                className="w-full py-3 sm:py-4 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-sm sm:text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-11 flex items-center justify-center gap-2"
                aria-busy={isBooking}
            >
                {isBooking ? (
                    <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Booking...
                    </>
                ) : (
                    "BOOK NOW"
                )}
            </button>

            {flight.availableSeats === 0 && (
                <p className="text-xs text-red-600 text-center mt-2">Flight is fully booked</p>
            )}
        </div>
    </div>
);

export default FlightDetailsPage;