const API_URL = "http://localhost:8080/api/categories";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user && user.token ? user.token : "";
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const getAllCategories = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return response.json();
};

export const createCategory = async (category) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
    });
    if (!response.ok) {
        throw new Error("Failed to create category");
    }
    return response.json();
};

export const updateCategory = async (id, category) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
    });
    if (!response.ok) {
        throw new Error("Failed to update category");
    }
    return response.json();
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error("Failed to delete category");
    }
};
