const UPLOAD_URL = "http://localhost:8080/api/upload";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? { "Authorization": `Bearer ${user.token}` } : {};
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData
    });
    if (!response.ok) throw new Error("Failed to upload image");
    const text = await response.text();
    return text;
};
