import { useState, type ChangeEvent, type FC, type KeyboardEvent } from "react";
import { Plane, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Reusable Input Component
interface InputFieldProps {
    icon: React.ElementType;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
}

const InputField: FC<InputFieldProps> = ({
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    onKeyPress,
    error,
    showPasswordToggle,
    onTogglePassword
}) => (
    <div>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                className={`w-full pl-12 pr-${showPasswordToggle ? '12' : '4'} py-3.5 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {showPasswordToggle && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {type === "password" ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

// Register Component
const Register: FC = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // UI state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle input change
    const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle registration
    const handleRegister = async (): Promise<void> => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


        try {
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                }),
            });


            const data = await response.json();

            if (!response.ok) {
                setErrors({ form: data.message || "Registration failed" });
                return;
            }

            // Save token and user data
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            // Navigate to home
            navigate("/home");
        } catch (err) {
            setErrors({ form: "Network error. Please try again." });
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Register Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100">
                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Start your journey with us today</p>
                    </div>

                    {/* Form Error */}
                    {errors.form && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.form}
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <InputField
                                icon={User}
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange("firstName")}
                                error={errors.firstName}
                            />
                            <InputField
                                icon={User}
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange("lastName")}
                                error={errors.lastName}
                            />
                        </div>

                        {/* Email */}
                        <InputField
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange("email")}
                            error={errors.email}
                        />

                        {/* Password */}
                        <InputField
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange("password")}
                            error={errors.password}
                            showPasswordToggle
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />

                        {/* Confirm Password */}
                        <InputField
                            icon={Lock}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            onKeyPress={handleKeyPress}
                            error={errors.confirmPassword}
                            showPasswordToggle
                            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        />

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-2 text-sm">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 text-blue-600 rounded" required />
                            <span className="text-gray-600">
                                I agree to the{" "}
                                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Terms & Conditions
                                </button>{" "}
                                and{" "}
                                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Privacy Policy
                                </button>
                            </span>
                        </div>

                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Sign Up */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="font-medium text-gray-700">Facebook</span>
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;