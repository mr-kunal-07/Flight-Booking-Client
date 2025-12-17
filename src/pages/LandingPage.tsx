import {
    Plane,
    TrendingDown,
    Shield,
    MapPin,
    Calendar,
    Users,
    Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";


interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
}

interface SearchFieldProps {
    label: string;
    icon: React.ElementType;
    value: string;
    setValue: (val: string) => void;
    placeholder: string;
}


const SearchField: React.FC<SearchFieldProps> = ({
    label,
    icon: Icon,
    value,
    setValue,
    placeholder
}) => (
    <div className="flex-1 min-w-35">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">
            {label}
        </label>

        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            <input
                type={label === "When" ? "date" : "text"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-500 rounded-xl focus:border-blue-500 focus:outline-none font-medium"
            />
        </div>
    </div>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100">
        <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center mb-3">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm  text-gray-600">{desc}</p>
    </div>
);


export default function LandingPage() {
    const navigate = useNavigate();

    const [tripType, setTripType] = useState("round");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [dates, setDates] = useState("");
    const [passengers, setPassengers] = useState("1");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const handleGetStarted = () => navigate("/login");

    const handleSearch = () => {
        setIsLoading(true);

        setTimeout(() => {
            navigate("/search", {
                state: { from, to, dates, passengers, tripType }
            });
            setIsLoading(false);
        }, 1000);
    };

    const features = [
        { icon: TrendingDown, title: "Best Prices", desc: "Compare prices from 100+ airlines" },
        { icon: Calendar, title: "Flexible Dates", desc: "Find cheapest days to fly" },
        { icon: MapPin, title: "Anywhere", desc: "Explore destinations worldwide" },
        { icon: Shield, title: "Secure Booking", desc: "Protected payments guaranteed" }
    ];


    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 via-blue-900 to-white overflow-hidden">
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
                }
                .floating {
                    animation: float 6s ease-in-out infinite;
                }
                .nav-appear {
                    animation: slideInDown 0.5s ease-out;
                }
                .glow-button {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                .loading-spinner {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Navigation */}
            <nav className="nav-appear fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-linear-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">FlightBook</span>
                    </div>
                    <button
                        onClick={handleGetStarted}
                        className="px-3 py-1.5 bg-linear-to-br from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl floating"></div>
                    <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1
                        className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 leading-tight"
                        style={{ animation: 'slideUp 0.8s ease-out' }}
                    >
                        Find your next
                        <span className="block bg-linear-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent -mt-1">adventure</span>
                    </h1>

                    <p
                        className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-tight"
                        style={{ animation: 'slideUp 0.8s ease-out 0.1s both' }}
                    >
                        Search, compare and book flights to anywhere in the world at the best prices
                    </p>

                    {/* Enhanced Search Card */}
                    <div
                        className="bg-white rounded-xl shadow-xl p-4 sm:p-8 backdrop-blur-xl border border-gray-200 glow-button"
                        style={{ animation: 'slideUp 0.8s ease-out 0.2s both' }}
                    >
                        {/* Trip Type Selector */}
                        <div className="flex gap-2 sm:gap-4 mb-8 border-b border-gray-100 pb-6 overflow-x-auto">
                            {[
                                { value: 'round', label: 'Round Trip' },
                                { value: 'oneway', label: 'One Way' },
                            ].map((trip) => (
                                <button
                                    key={trip.value}
                                    onClick={() => setTripType(trip.value)}
                                    className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${tripType === trip.value
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 border-b-2 bg-gray-50'
                                        }`}
                                >
                                    {trip.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                            <SearchField
                                label="From"
                                icon={MapPin}
                                value={from}
                                setValue={setFrom}
                                placeholder="From airport"
                            />
                            <SearchField
                                label="To"
                                icon={MapPin}
                                value={to}
                                setValue={setTo}
                                placeholder="To airport"
                            />
                            <SearchField
                                label="When"
                                icon={Calendar}
                                value={dates}
                                setValue={setDates}
                                placeholder="Select dates"
                            />
                            <div className="flex-1 min-w-35">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Passengers</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <select
                                        value={passengers}
                                        onChange={(e) => setPassengers(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-500 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-gray-900 transition-all duration-200"
                                    >
                                        <option value="1">1 Adult</option>
                                        <option value="2">2 Adults</option>
                                        <option value="3">3 Adults</option>
                                        <option value="4">4+ Adults</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="loading-spinner">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Search Flights
                                </>
                            )}
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div
                        className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-700"
                        style={{ animation: 'slideUp 0.8s ease-out 0.3s both' }}
                    >
                        {[
                            { icon: '✓', text: 'Free cancellation' },
                            { icon: '✓', text: 'No hidden fees' },
                            { icon: '✓', text: 'Best price guarantee' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-md border border-gray-200 hover:bg-white/80 transition-all duration-200">
                                <span className="text-green-600 font-bold">{item.icon}</span>
                                <span className="font-medium hidden sm:inline">{item.text}</span>
                                <span className="font-medium sm:hidden text-xs">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-10 sm:py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                            Why book with us?
                        </h2>
                        <p className="text-gray-600 text-md tracking-tight max-w-2xl mx-auto">
                            Join millions of travelers finding their perfect flights
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-linear-to-b from-slate-950 via-blue-900 to-white py-16 sm:py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
                        Ready to explore?
                    </h3>
                    <p className="text-blue-100 text-lg mb-8">
                        Start searching for your next flight and save up to 40% on your bookings
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        Search Flights Now
                    </button>
                </div>
            </div>
        </div>
    );
}