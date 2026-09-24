import { useEffect, useState } from "react";

import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../services/employeeService";

import "../css/style.css";


function Dashboard({ onLogout }) {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [employee, setEmployee] = useState({
        id: "",
        name: "",
        emailAddress: "",
        department: "",
        position: "",
        dob: ""
    });


    // ================================
    // GET ALL EMPLOYEES
    // ================================

    const handleGetEmployees = async () => {

        try {

            setLoading(true);

            const result = await getAllEmployees();

            console.log("Employees:", result);

            if (result?.data) {
                setEmployees(result.data);
            }
            else {
                setEmployees([]);
            }

        }
        catch (error) {

            console.error(
                "Get Employees Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to get employees"
            );

        }
        finally {

            setLoading(false);
        }
    };


    // ================================
    // LOAD EMPLOYEES
    // ================================

    useEffect(() => {

        handleGetEmployees();

    }, []);


    // ================================
    // INPUT CHANGE
    // ================================

    const handleChange = (e) => {

        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };


    // ================================
    // CREATE / UPDATE
    // ================================

    const handleSaveEmployee = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            let result;

            if (editMode) {

                result = await updateEmployee(employee);

                alert(
                    result?.message ||
                    "Employee Updated Successfully!"
                );

            }
            else {

                result = await createEmployee(employee);

                alert(
                    result?.message ||
                    "Employee Created Successfully!"
                );
            }


            setEmployee({
                id: "",
                name: "",
                emailAddress: "",
                department: "",
                position: "",
                dob: ""
            });

            setEditMode(false);

            setShowForm(false);

            await handleGetEmployees();

        }
        catch (error) {

            console.error(
                "Save Employee Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Operation failed"
            );

        }
        finally {

            setLoading(false);
        }
    };


    // ================================
    // EDIT
    // ================================

    const handleEditEmployee = (employeeData) => {

        setEmployee({

            id: employeeData.id,

            name:
                employeeData.name || "",

            emailAddress:
                employeeData.emailAddress || "",

            department:
                employeeData.department || "",

            position:
                employeeData.position || "",

            dob:
                employeeData.dob
                    ? employeeData.dob.substring(0, 10)
                    : ""
        });

        setEditMode(true);

        setShowForm(true);
    };


    // ================================
    // DELETE
    // ================================

    const handleDeleteEmployee = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this employee?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            setLoading(true);

            const result =
                await deleteEmployee(id);

            alert(
                result?.message ||
                "Employee Deleted Successfully!"
            );

            await handleGetEmployees();

        }
        catch (error) {

            console.error(
                "Delete Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete employee"
            );

        }
        finally {

            setLoading(false);
        }
    };


    // ================================
    // LOGOUT
    // ================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        onLogout();
    };


    // ================================
    // ADD EMPLOYEE
    // ================================

    const handleAddEmployee = () => {

        setEditMode(false);

        setEmployee({
            id: "",
            name: "",
            emailAddress: "",
            department: "",
            position: "",
            dob: ""
        });

        setShowForm(true);
    };


    return (

        <div className="dashboard">


            {/* =========================
                NAVBAR
            ========================= */}

            <div className="navbar">

                <h2>
                    MyFirstApi
                </h2>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>


            {/* =========================
                DASHBOARD
            ========================= */}

            <div className="dashboard-container">

                <h1 className="dashboard-title">
                    Employee Dashboard
                </h1>


                {/* ADD EMPLOYEE BUTTON */}

                <button
                    className="primary-button"
                    onClick={handleAddEmployee}
                >
                    + Add Employee
                </button>


                {/* =========================
                    FORM
                ========================= */}

                {showForm && (

                    <div className="employee-form">

                        <h2>

                            {editMode
                                ? "Update Employee"
                                : "Create Employee"
                            }

                        </h2>


                        <form
                            onSubmit={handleSaveEmployee}
                        >

                            <div className="employee-grid">


                                {/* NAME */}

                                <div>

                                    <label>
                                        Name
                                    </label>

                                    <input
                                        name="name"
                                        value={employee.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Name"
                                    />

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="emailAddress"
                                        value={
                                            employee.emailAddress
                                        }
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Email"
                                    />

                                </div>


                                {/* DEPARTMENT */}

                                <div>

                                    <label>
                                        Department
                                    </label>

                                    <input
                                        name="department"
                                        value={
                                            employee.department
                                        }
                                        onChange={handleChange}
                                        placeholder="Enter Department"
                                    />

                                </div>


                                {/* POSITION */}

                                <div>

                                    <label>
                                        Position
                                    </label>

                                    <input
                                        name="position"
                                        value={
                                            employee.position
                                        }
                                        onChange={handleChange}
                                        placeholder="Enter Position"
                                    />

                                </div>


                                {/* DOB */}

                                <div>

                                    <label>
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dob"
                                        value={
                                            employee.dob
                                        }
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            <br />


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : editMode
                                        ? "Update Employee"
                                        : "Create Employee"
                                }

                            </button>


                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {

                                    setShowForm(false);

                                    setEditMode(false);

                                }}
                                style={{
                                    marginLeft: "10px"
                                }}
                            >
                                Cancel
                            </button>

                        </form>

                    </div>

                )}


                {/* =========================
                    EMPLOYEE LIST
                ========================= */}

                <div className="employee-table-container">

                    <h2>
                        Employee List
                    </h2>


                    <button
                        className="secondary-button"
                        onClick={handleGetEmployees}
                        disabled={loading}
                    >

                        {loading
                            ? "Loading..."
                            : "Refresh Employees"
                        }

                    </button>


                    <br />
                    <br />


                    {employees.length === 0 ? (

                        <p>
                            No Employees Found
                        </p>

                    ) : (

                        <table className="employee-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Position
                                    </th>

                                    <th>
                                        DOB
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {employees.map(
                                    (emp) => (

                                        <tr
                                            key={emp.id}
                                        >

                                            <td>
                                                {emp.name}
                                            </td>

                                            <td>
                                                {emp.emailAddress}
                                            </td>

                                            <td>
                                                {emp.department}
                                            </td>

                                            <td>
                                                {emp.position}
                                            </td>

                                            <td>
                                                {emp.dob}
                                            </td>

                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditEmployee(
                                                            emp
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteEmployee(
                                                            emp.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;