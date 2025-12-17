import { useState, useEffect, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, User, Mail, Phone, Shield } from "lucide-react";

interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    airlineLogo: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: string;
    duration: number;
}

interface PassengerForm {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
}

const BookingConfirmation: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
    });
    const [passengers, setPassengers] = useState<PassengerForm[]>([
        { firstName: "", lastName: "", age: 30, gender: "Male" },
    ]);

    const flightId = searchParams.get("flightId");
    const adults = parseInt(searchParams.get("adults") || "1");

    useEffect(() => {
        // Initialize passengers array
        setPassengers(
            Array.from({ length: adults }, () => ({
                firstName: "",
                lastName: "",
                age: 30,
                gender: "Male",
            }))
        );
        fetchFlight();
    }, [adults]);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchFlight = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/flights/${flightId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setFlight(data.data);
        } catch (error) {
            console.error("Failed to fetch flight:", error);
        } finally {
            setLoading(false);
        }
    };


    const handlePassengerChange = (index: number, field: keyof PassengerForm, value: string | number) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };

    const validateForm = () => {
        if (!contactInfo.email || !contactInfo.phone) {
            alert("Please enter contact email and phone");
            return false;
        }

        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            if (!p.firstName || !p.lastName) {
                alert(`Please fill all details for Passenger ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const handleBooking = async () => {
        if (!validateForm() || !flight) return;

        setBooking(true);
        try {
            const response = await fetch(`${apiUrl}/api/bookings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    flightId: flight.id,
                    numberOfPassengers: adults,
                    totalAmount: Number(flight.price) * adults,
                    contactEmail: contactInfo.email,
                    contactPhone: contactInfo.phone,
                    passengers,
                }),
            });

            const data = await response.json();

            // Log the full response for debugging
            console.log('Booking Response:', data);

            if (response.ok) {
                navigate(`/my-bookings`);
            } else {
                // Show the actual error message
                alert(`Booking failed: ${data.message}\n${data.details || ''}`);
                console.error('Booking failed:', data);
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Network error. Please check console for details.");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Flight not found</h2>
                    <button onClick={() => navigate("/home")} className="text-blue-600 hover:underline">
                        Go back to home
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = parseFloat(flight.price) * adults;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flight Summary */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Flight Details</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                                    <img src={flight.airlineLogo} alt={flight.airline} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <div className="font-bold">{flight.airline}</div>
                                    <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-600">Route</div>
                                    <div className="font-semibold">
                                        {flight.origin} → {flight.destination}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600">Passengers</div>
                                    <div className="font-semibold">{adults}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        {passengers.map((passenger, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    <User className="w-5 h-5 inline mr-2" />
                                    Passenger {index + 1}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={passenger.firstName}
                                            onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={passenger.lastName}
                                            onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                        <input
                                            type="number"
                                            value={passenger.age}
                                            onChange={(e) => handlePassengerChange(index, "age", parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            max="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                        <select
                                            value={passenger.gender}
                                            onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>

                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h2>
                            <div className="space-y-3 mb-4 pb-4 border-b">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Base Fare × {adults}</span>
                                    <span className="font-semibold">₹{parseFloat(flight.price).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Taxes & Fees</span>
                                    <span className="font-semibold">₹0</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-2xl text-blue-600">₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                    <div className="font-semibold mb-1">Secure Payment</div>
                                    Your payment information is encrypted and secure
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={booking}
                                className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {booking ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Confirm & Pay
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                By booking, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;