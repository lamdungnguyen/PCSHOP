const API_URL = "http://localhost:8080/api/admin/users";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? { "Authorization": `Bearer ${user.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

export async function getAllUsers() {
    const res = await fetch(API_URL, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete user");
}

export async function updateUser(id, userData) {
    // If not admin, normal users must use /api/users/me
    const userSettings = JSON.parse(localStorage.getItem("user"));
    const isAdmin = userSettings && userSettings.role === 'ADMIN';

    const url = isAdmin ? `${API_URL}/${id}` : `http://localhost:8080/api/users/me`;

    const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update user");
    }
    return res.json();
}
