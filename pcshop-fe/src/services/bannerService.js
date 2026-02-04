import { uploadImage } from "./uploadService";

const API_URL = "http://localhost:8080/api/banners";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? { "Authorization": `Bearer ${user.token}` } : {};
};

export const getAllBanners = async () => {
    const response = await fetch(API_URL, { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } });
    if (!response.ok) throw new Error("Failed to fetch banners");
    return response.json();
};

export const getActiveBanners = async () => {
    const response = await fetch(`${API_URL}/active`);
    if (!response.ok) throw new Error("Failed to fetch active banners");
    return response.json();
};

export const createBanner = async (banner) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(banner)
    });
    if (!response.ok) throw new Error("Failed to create banner");
    return response.json();
};

export const deleteBanner = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to delete banner");
};

export { uploadImage };
