import axios from "axios";

const API_URL = "https://localhost:7160/api/Salary";

export const getSalaryByEmployeeId = async (employeeId) => {
    const response = await axios.get(
        `${API_URL}/Employee/${employeeId}`
    );

    return response.data;
};