import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginSuccess() {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/login");
            return;
        }

        // 1. Lưu token
        localStorage.setItem("token", token);

        // 2. Lấy user hiện tại
        fetch("http://localhost:8080/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                return response.json();
            })
            .then((data) => {
                login({ ...data, token }); // Cập nhật context + localStorage kèm token

                // 3. Điều hướng theo role
                if (data.role === "ADMIN") {
                    // Redirect Admin to Home as requested
                    navigate("/");
                } else {
                    navigate("/");
                }
            })
            .catch(() => navigate("/login"));
    }, []);

    return <p className="text-center mt-20">Logging in...</p>;
}
