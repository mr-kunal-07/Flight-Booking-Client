import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
    children,
    redirectTo = "/home"
}) => {
    if (isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
};