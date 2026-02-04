const API_URL = "http://localhost:8080/api/orders";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? { "Authorization": `Bearer ${user.token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

export async function getMyOrders() {
    const res = await fetch(`${API_URL}/my-orders`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export async function createOrder(items) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(items)
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
}
// ADMIN: Get All Orders
export async function getAllOrders() {
    const res = await fetch(`${API_URL}/all`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch all orders");
    return res.json();
}

// ADMIN: Update Status
export async function updateOrderStatus(id, status) {
    const res = await fetch(`${API_URL}/${id}/status?status=${status}`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
}
