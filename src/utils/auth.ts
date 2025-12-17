export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
};

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};