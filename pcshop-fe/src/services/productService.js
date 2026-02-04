const API_URL = "http://localhost:8080/api/products";

export async function getAllProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

export async function searchProducts(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/search?${query}`);
  if (!res.ok) {
    throw new Error("Failed to search products");
  }
  return res.json();
}

export async function getCategories() {
  const res = await fetch("http://localhost:8080/api/categories");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function getReviews(productId) {
  const res = await fetch(`http://localhost:8080/api/reviews/product/${productId}`);
  if (!res.ok) return []; // Return empty if error or 404
  return res.json();
}

export async function createReview(review) {
  const res = await fetch(`http://localhost:8080/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error("Failed to post review");
  return res.json();
}

export async function getRelatedProducts(categoryId) {
  if (!categoryId) return [];
  // Use existing search/filter API
  const res = await fetch(`${API_URL}/search?categoryId=${categoryId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createCategory(category) {
  const res = await fetch("http://localhost:8080/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}
