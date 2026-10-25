const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
  } catch {
    throw new Error("Cannot connect to the backend. Make sure the server is running on port 5002.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export const getRandomQuestions = () => request("/questions/random");
export const submitSurvey = (answers) =>
  request("/surveys", { method: "POST", body: JSON.stringify({ answers }) });

export const getQuestions = (key) =>
  request("/questions", { headers: { "x-admin-key": key } });

export const addQuestion = (key, question) =>
  request("/questions", {
    method: "POST",
    headers: { "x-admin-key": key },
    body: JSON.stringify(question)
  });

export const deleteQuestion = (key, id) =>
  request(`/questions/${id}`, { method: "DELETE", headers: { "x-admin-key": key } });

export const getResponses = (key) =>
  request("/admin/responses", { headers: { "x-admin-key": key } });
