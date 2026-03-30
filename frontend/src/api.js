import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export async function signup(data) {
  try {
    const res = await API.post("/signup", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function login(data) {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getSkills(token) {
  try {
    const res = await API.get("/skills/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function createSkill(title, token) {
  try {
    const res = await API.post(
      "/skills/",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateSkill(skillId, title, token) {
  try {
    const res = await API.put(
      `/skills/${skillId}/`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteSkill(skillId, token) {
  try {
    const res = await API.delete(`/skills/${skillId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getNotes(skillId, token) {
  try {
    const res = await API.get(`/skills/${skillId}/notes/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function createNote(skillId, content, token) {
  try {
    const res = await API.post(
      `/skills/${skillId}/notes/`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateNote(skillId, noteId, content, token) {
  try {
    const res = await API.put(
      `/skills/${skillId}/notes/${noteId}/`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteNote(skillId, noteId, token) {
  try {
    const res = await API.delete(`/skills/${skillId}/notes/${noteId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}