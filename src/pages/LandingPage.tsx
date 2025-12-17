import { Plane, TrendingDown, Shield, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
    </div>
);

export default function LandingPage() {
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/search", { replace: true });
        }
    }, [navigate]);

    const handleGetStarted = () => {
        navigate("/login");
    };

    const features = [
        { icon: TrendingDown, title: "Best Prices", desc: "Compare prices from 100+ airlines" },
        { icon: Calendar, title: "Flexible Dates", desc: "Find cheapest days to fly" },
        { icon: MapPin, title: "Anywhere", desc: "Explore destinations worldwide" },
        { icon: Shield, title: "Secure Booking", desc: "Protected payments guaranteed" }
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plane className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">FlightBook</span>
                    </div>
                    <button
                        onClick={handleGetStarted}
                        className="px-6 py-2.5 cursor-pointer hover:scale-105 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Find your next
                        <span className="block text-blue-600">adventure</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10">
                        Search, compare and book flights to anywhere in the world at the best prices
                    </p>

                    {/* Search Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-left">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">From</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Mumbai (BOM)</span>
                                </div>
                            </div>
                            <div className="text-left">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">To</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Where to?</span>
                                </div>
                            </div>
                            <div className="text-left">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">When</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Select dates</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleGetStarted}
                            className="w-full cursor-pointer hover:scale-[1.02] ease-in-out bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Search Flights
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Free cancellation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>No hidden fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Best price guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why book with us?
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Join millions of travelers finding their perfect flights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <FeatureCard key={i} {...f} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
