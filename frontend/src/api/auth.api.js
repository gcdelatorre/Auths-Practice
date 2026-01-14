import api from "./axios.js"

export const register = async (email, password) => {
    api.post("/register", { email, password })
}

export const login = async (email, password) => {
    api.post("/login", { email, password })
}

export const logout = async () => {
    api.post("/logout")
}

export const getProtected = async () => {
    api.post("/protected")
}
