import api from "./axios.js"

export const register = async (email, password) => {
    return api.post("/register", { email, password })
}

export const login = async (email, password) => {
    return api.post("/login", { email, password })
}

export const logout = async () => {
    return api.post("/logout")
}

export const getProtected = async () => {
    return api.post("/protected")
}
