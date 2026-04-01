import axios from "axios";

const API = axios.create({
  baseURL: "https://skill-notes-app.onrender.com",
});

// Debug log
console.log("API Base URL:", API.defaults.baseURL, "at", new Date().toISOString());

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["token"] = token;
  } else {
    delete API.defaults.headers.common["token"];
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
    const formData = new URLSearchParams();
    formData.append("username", data.email); 
    formData.append("password", data.password);

    const res = await API.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}


export async function getSkills() {
  try {
    const res = await API.get("/skills");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function createSkill(title) {
  try {
    const res = await API.post("/skills", { title });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateSkill(skillId, title) {
  try {
    const res = await API.put(`/skills/${skillId}`, { title });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteSkill(skillId) {
  try {
    const res = await API.delete(`/skills/${skillId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getNotes(skillId) {
  try {
    const res = await API.get(`/skills/${skillId}/notes`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function createNote(skillId, content) {
  try {
    const res = await API.post(`/skills/${skillId}/notes`, { content });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateNote(skillId, noteId, content) {
  try {
    const res = await API.put(
      `/skills/${skillId}/notes/${noteId}`,
      { content }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteNote(skillId, noteId) {
  try {
    const res = await API.delete(
      `/skills/${skillId}/notes/${noteId}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}