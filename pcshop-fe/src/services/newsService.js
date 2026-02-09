const API_URL = "http://localhost:8080/api/news";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user && user.token ? user.token : "";
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const getAllNews = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    return response.json();
};

export const getNewsById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch news details");
    }
    return response.json();
};

export const createNews = async (news) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(news)
    });
    if (!response.ok) {
        throw new Error("Failed to create news");
    }
    return response.json();
};

export const updateNews = async (id, news) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(news)
    });
    if (!response.ok) {
        throw new Error("Failed to update news");
    }
    return response.json();
};

export const deleteNews = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error("Failed to delete news");
    }
};
