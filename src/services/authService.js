import axios from "axios";

const API_URL = "https://localhost:7160/api/Auth";


// ==============================
// LOGIN
// ==============================

export const loginUser = async (email, password) => {

    const response = await axios.post(
        `${API_URL}/Login`,
        {
            email: email,
            password: password
        }
    );

    return response.data;
};


// ==============================
// REGISTER
// ==============================

export const registerUser = async (
    name,
    email,
    password
) => {

    const response = await axios.post(
        `${API_URL}/Register`,
        {
            name: name,
            email: email,
            password: password
        }
    );

    return response.data;
};