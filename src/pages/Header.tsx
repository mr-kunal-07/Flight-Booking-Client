import { LogOut, Plane } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
    user: any;
    onLogout: () => void;
    onMyBookings?: () => void;
}

/* ---------- Reusable UI ---------- */


const DropdownItem = ({ onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
    >
        <Icon className="w-4 h-4 text-gray-500" />
        {label}
    </button>
);

/* ---------- Header ---------- */
const Header = ({ user, onLogout, onMyBookings }: HeaderProps) => {
    const [open, setOpen] = useState(false);
    const initials = (user?.firstName?.[0] || user?.name?.[0] || "U").toUpperCase();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-xl text-gray-900 tracking-tight">FlightBook</h1>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {onMyBookings && (
                            <button
                                onClick={onMyBookings}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                My Bookings
                            </button>
                        )}

                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-semibold">
                                    {initials}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.firstName || user?.name || "Guest"}
                                </span>
                            </div>

                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Profile */}
                    <div className="relative md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
                        >
                            {initials}
                        </button>

                        {open && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.firstName || user?.name || "Guest"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {user?.email || ""}
                                        </p>
                                    </div>

                                    {onMyBookings && (
                                        <DropdownItem
                                            onClick={() => {
                                                onMyBookings();
                                                setOpen(false);
                                            }}
                                            icon={Plane}
                                            label="My Bookings"
                                        />
                                    )}
                                    <DropdownItem
                                        onClick={onLogout}
                                        icon={LogOut}
                                        label="Logout"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
