import { useState, type FC } from "react";
import { Plane, Calendar, Users, ArrowLeftRight, MapPin } from "lucide-react";

interface Travelers {
    adults: number;
    children: number;
    infants: number;
}

interface FlightSearchProps {
    onSearch: (params: {
        origin: string;
        destination: string;
        travelDate: string;
        passengers: number;
    }) => void;
}

interface TravelerRowProps {
    label: string;
    subtitle: string;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    minValue?: number;
}

const FlightSearch: FC<FlightSearchProps> = ({ onSearch }) => {
    const [origin, setOrigin] = useState<string>("Delhi");
    const [destination, setDestination] = useState<string>("Mumbai");
    const [departureDate, setDepartureDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [returnDate, setReturnDate] = useState<string>("");
    const [tripType, setTripType] = useState<string>("one-way");
    const [showTravelerModal, setShowTravelerModal] = useState<boolean>(false);
    const [travelers, setTravelers] = useState<Travelers>({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [cabinClass, setCabinClass] = useState<string>("Economy");

    const updateTravelerCount = (type: keyof Travelers, delta: number): void => {
        setTravelers(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    const getTravelerText = (): string => {
        const total = travelers.adults + travelers.children + travelers.infants;
        const travelerWord = total === 1 ? "Traveller" : "Travellers";
        return `${total} ${travelerWord}, ${cabinClass}`;
    };

    const swapLocations = (): void => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const formatDateDisplay = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            year: 'numeric'
        };
        return date.toLocaleDateString('en-IN', options);
    };

    const handleSearch = (): void => {
        const totalPassengers = travelers.adults + travelers.children + travelers.infants;

        if (!origin.trim() || !destination.trim()) {
            alert("Please enter both origin and destination");
            return;
        }

        if (!departureDate) {
            alert("Please select a departure date");
            return;
        }

        onSearch({
            origin: origin.trim(),
            destination: destination.trim(),
            travelDate: departureDate,
            passengers: totalPassengers
        });
    };

    return (
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">


            <div className="p-6">
                {/* Trip Type Selector */}
                <div className="flex gap-3 mb-6">
                    {[
                        { value: "one-way", label: "One Way" },
                        { value: "round-trip", label: "Round Trip" }
                    ].map((type) => (
                        <button
                            key={type.value}
                            onClick={() => setTripType(type.value)}
                            className={`
                                flex-1 py-3 rounded-xl font-semibold text-sm
                                transition-all duration-300
                                ${tripType === type.value
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }
                            `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Locations */}
                <div className="relative mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Origin */}
                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-all">
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                FROM
                            </label>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="City or Airport"
                                    className="flex-1 bg-transparent text-lg font-bold text-gray-900 outline-none"
                                />
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-all">
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                TO
                            </label>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="City or Airport"
                                    className="flex-1 bg-transparent text-lg font-bold text-gray-900 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={swapLocations}
                        className="
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-10 h-10 bg-white rounded-full
                            border-2 border-blue-500 shadow-lg
                            flex items-center justify-center
                            hover:bg-blue-50 hover:scale-110
                            transition-all z-10
                        "
                    >
                        <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                    </button>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Departure Date */}
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-all">
                        <label className="text-xs font-semibold text-gray-500 mb-2 block">
                            DEPARTURE DATE
                        </label>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="flex-1 bg-transparent text-base font-semibold text-gray-900 outline-none"
                            />
                        </div>
                        {departureDate && (
                            <p className="text-xs text-gray-600 mt-1">
                                {formatDateDisplay(departureDate)}
                            </p>
                        )}
                    </div>

                    {/* Return Date */}
                    {tripType === "round-trip" && (
                        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-all">
                            <label className="text-xs font-semibold text-gray-500 mb-2 block">
                                RETURN DATE
                            </label>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    min={departureDate || new Date().toISOString().split("T")[0]}
                                    className="flex-1 bg-transparent text-base font-semibold text-gray-900 outline-none"
                                />
                            </div>
                            {returnDate && (
                                <p className="text-xs text-gray-600 mt-1">
                                    {formatDateDisplay(returnDate)}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Travelers & Class */}
                <button
                    onClick={() => setShowTravelerModal(true)}
                    className="
                        w-full bg-gray-50 rounded-xl p-4
                        border-2 border-gray-200
                        hover:border-blue-400 hover:shadow-md
                        transition-all text-left mb-6
                    "
                >
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        TRAVELLERS & CLASS
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-base font-semibold text-gray-900">
                            {getTravelerText()}
                        </span>
                    </div>
                </button>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="
                        w-full py-4 rounded-xl
                        bg-gradient-to-r from-blue-600 to-indigo-600
                        text-white font-bold text-lg
                        shadow-xl hover:shadow-2xl
                        hover:from-blue-700 hover:to-indigo-700
                        transition-all flex items-center justify-center gap-2
                    "
                >
                    <Plane className="w-5 h-5" />
                    SEARCH FLIGHTS
                </button>
            </div>

            {/* Traveler Modal */}
            {showTravelerModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                Travellers & Class
                            </h3>
                            <button
                                onClick={() => setShowTravelerModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 mb-4">
                                    NUMBER OF TRAVELLERS
                                </h4>
                                <div className="space-y-4">
                                    <TravelerRow
                                        label="Adults"
                                        subtitle="12+ years"
                                        count={travelers.adults}
                                        onIncrement={() => updateTravelerCount('adults', 1)}
                                        onDecrement={() => updateTravelerCount('adults', -1)}
                                        minValue={1}
                                    />
                                    <TravelerRow
                                        label="Children"
                                        subtitle="2-12 years"
                                        count={travelers.children}
                                        onIncrement={() => updateTravelerCount('children', 1)}
                                        onDecrement={() => updateTravelerCount('children', -1)}
                                    />
                                    <TravelerRow
                                        label="Infants"
                                        subtitle="Under 2 years"
                                        count={travelers.infants}
                                        onIncrement={() => updateTravelerCount('infants', 1)}
                                        onDecrement={() => updateTravelerCount('infants', -1)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 mb-3">
                                    CABIN CLASS
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => setCabinClass(cls)}
                                            className={`
                                                px-4 py-3 rounded-xl font-medium text-sm
                                                transition-all
                                                ${cabinClass === cls
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }
                                            `}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowTravelerModal(false)}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                DONE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TravelerRow: FC<TravelerRowProps> = ({
    label,
    subtitle,
    count,
    onIncrement,
    onDecrement,
    minValue = 0
}) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <div className="font-semibold text-gray-900">{label}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
        <div className="flex items-center gap-3">
            <button
                onClick={onDecrement}
                disabled={count <= minValue}
                className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
            >
                −
            </button>
            <span className="w-8 text-center font-bold text-gray-900">{count}</span>
            <button
                onClick={onIncrement}
                className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-lg"
            >
                +
            </button>
        </div>
    </div>
);

export default FlightSearch;