const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "An unknown error occurred");
    }
    return response.json();
};

export const generateQuiz = async (url) => {
    const response = await fetch(`${API_URL}/generate_quiz`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    });
    return handleResponse(response);
};

export const getHistory = async () => {
    const response = await fetch(`${API_URL}/history`);
    return handleResponse(response);
};

export const getQuizById = async (id) => {
    const response = await fetch(`${API_URL}/quiz/${id}`);
    return handleResponse(response);
};