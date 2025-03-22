export const getUser = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return null;
    return JSON.parse(user); // Convert user data back to an object
};
