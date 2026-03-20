const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:4000").trim();

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof data === "string" ? data : data?.message;
        const error = new Error(message || "Request failed.");
        error.status = response.status;
        throw error;
    }

    return data;
}

function get(path) {
    return request(path, { method: "GET" });
}

function post(path, body) {
    return request(path, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

function patch(path, body) {
    return request(path, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

function remove(path) {
    return request(path, {
        method: "DELETE",
    });
}

export const apiClient = {
    get,
    patch,
    post,
    remove,
};
