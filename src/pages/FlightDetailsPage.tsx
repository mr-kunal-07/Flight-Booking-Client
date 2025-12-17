import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Plane,
    Luggage,
    AlertCircle,
    Loader2,
} from "lucide-react";

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

const FlightDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState<FlightDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [passengers, setPassengers] = useState(1);

    useEffect(() => {
        fetchFlightDetails();
    }, [id]);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


    const fetchFlightDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiUrl}/api/flights/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setFlight(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch flight:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (datetime: string) =>
        new Date(datetime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const formatDate = (datetime: string) =>
        new Date(datetime).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Flight not found</h2>
                    <button onClick={() => navigate("/home")} className="text-blue-600 hover:underline">
                        Go back to home
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-linear-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-3">
                        <button
                            onClick={() => navigate("/home")}
                            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">Complete your booking</h1>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-sm">
                            <div className="text-blue-200">Trip Summary</div>
                            <div className="text-blue-200">•</div>
                            <div className="text-blue-200">Travel Info</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Flight Info Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Route Header */}
                            <div className="bg-linear-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {flight.origin} → {flight.destination}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                            <span>{formatDate(flight.departureTime)}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                Non Stop • {formatDuration(flight.duration)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold inline-block">
                                            CANCELLATION FEES APPLY
                                        </div>
                                        <button className="text-blue-600 text-sm mt-2 hover:underline block">
                                            View Fare Rules
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Details */}
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Airline Logo */}
                                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 shrink-0">
                                        <img
                                            src={flight.airlineLogo}
                                            alt={flight.airline}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Flight Info */}
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{flight.airline}</span>
                                            <span className="text-sm text-gray-600">{flight.flightNumber}</span>
                                        </div>
                                        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs inline-block">
                                            Economy &gt; SAVER
                                        </div>

                                        {/* Route */}
                                        <div className="mt-6 flex items-center gap-6">
                                            {/* Departure */}
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {formatTime(flight.departureTime)}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-700 mt-1">
                                                    {flight.origin}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Indira Gandhi International Airport, Terminal T1
                                                </div>
                                            </div>

                                            {/* Duration Line */}
                                            <div className="flex-1 flex flex-col items-center px-4">
                                                <div className="text-xs text-gray-500 mb-2">
                                                    {formatDuration(flight.duration)}
                                                </div>
                                                <div className="w-full h-px bg-gray-300 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div>
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {formatTime(flight.arrivalTime)}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-700 mt-1">
                                                    {flight.destination}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Bengaluru International Airport, Terminal T1
                                                </div>
                                            </div>
                                        </div>

                                        {/* Baggage Info */}
                                        <div className="mt-6 flex items-center gap-8 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Luggage className="w-4 h-4 text-orange-600" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Cabin Baggage:</span>
                                                    <span className="text-gray-600 ml-1">7 Kgs (1 piece only) / Adult</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Luggage className="w-4 h-4 text-orange-600" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Check-In Baggage:</span>
                                                    <span className="text-gray-600 ml-1">15 Kgs (1 piece only) / Adult</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extra Baggage */}
                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                                            <Luggage className="w-5 h-5 text-blue-600 shrink-0" />
                                            <div className="text-sm text-gray-700">
                                                Got excess baggage? Don't stress, buy extra check-in baggage allowance for DEL-BLR at fab rates!
                                            </div>
                                            <button className="text-blue-600 font-semibold text-sm whitespace-nowrap ml-2">
                                                ADD BAGGAGE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Cancellation & Date Change Policy</h3>
                                <button className="text-blue-600 text-sm hover:underline">View Policy</button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="font-semibold text-gray-700">{flight.origin}-{flight.destination}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Cancellation Penalty:</div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                                    <div className="absolute left-0 top-0 h-full bg-linear-to-r from-green-500 via-yellow-500 to-red-500 w-full"></div>
                                </div>

                                {/* Time Slots */}
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900 mb-1">Now</div>
                                        <div className="text-green-600 font-semibold">₹4,349</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900 mb-1">18 Dec</div>
                                        <div className="text-gray-600">05:30</div>
                                        <div className="text-yellow-600 font-semibold mt-1">₹5,349</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900 mb-1">19 Dec</div>
                                        <div className="text-gray-600">02:30</div>
                                        <div className="text-orange-600 font-semibold mt-1">₹7,537</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900 mb-1">19 Dec</div>
                                        <div className="text-gray-600">05:30</div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 mt-4">
                                    Cancel Between (IST):
                                    <span className="font-semibold ml-1">Now - 18 Dec 05:30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Fare Summary</h3>

                            {/* Passengers */}
                            <div className="mb-4">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Number of Passengers
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg"
                                    >
                                        −
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="text-2xl font-bold text-gray-900">{passengers}</div>
                                        <div className="text-xs text-gray-500">
                                            {passengers === 1 ? "Passenger" : "Passengers"}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPassengers(Math.min(flight.availableSeats, passengers + 1))}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg disabled:opacity-50"
                                        disabled={passengers >= flight.availableSeats}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 py-4 border-t border-b border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Base Fare × {passengers}</span>
                                    <span className="font-semibold text-gray-900">
                                        ₹{(basePrice * passengers).toLocaleString("en-IN")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span className="font-semibold text-gray-900">₹0</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="py-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            ₹{totalPrice.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Seats Warning */}
                            {isLowSeats && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                                        <span className="font-semibold text-orange-800">
                                            Only {flight.availableSeats} seats left!
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Book Button */}
                            <button
                                onClick={() =>
                                    navigate(
                                        `/booking-confirmation?flightId=${flight.id}&adults=${passengers}`
                                    )
                                }
                                disabled={flight.availableSeats === 0}
                                className="w-full py-4 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                BOOK NOW
                            </button>


                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FlightDetailsPage;