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
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
}
