import { useEffect, useState } from "react";
import Salary from "./Salary";

import {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../services/employeeService";

import {
    getSalaryByEmployeeId,
    addSalary
} from "../services/salaryService";
import "../css/style.css";


function Dashboard({ onLogout }) {

    const [showSalary, setShowSalary] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [salaryDetails, setSalaryDetails] = useState([]);


    const [salaryLoading, setSalaryLoading] = useState(false);

    // Selected employee for popup
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Show Add Salary form
    const [showSalaryForm, setShowSalaryForm] = useState(false);

    const [salary, setSalary] = useState({
    salaryMonth: "",
    salaryDate: "",
    paymentStatus: "Pending",
    remarks: ""
});

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

            console.error("Get Employees Error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to get employees"
            );

        }
        finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        handleGetEmployees();
    }, []);


    // ================================
    // EMPLOYEE INPUT CHANGE
    // ================================

    const handleChange = (e) => {

        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });

    };


    // ================================
    // SAVE EMPLOYEE
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

    const employeeData = {
        name: employee.name,
        emailAddress: employee.emailAddress,
        department: employee.department,
        position: employee.position,
        dob: employee.dob || null
    };

    console.log("Create Employee Data:", employeeData);

    result = await createEmployee(employeeData);

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

    console.error("Save Employee Error:", error);

    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("MESSAGE:", error.message);

    alert(
        JSON.stringify(
            error.response?.data ||
            error.message ||
            "Operation failed"
        )
    );

}
        finally {

            setLoading(false);

        }

    };


    // ================================
    // EDIT EMPLOYEE
    // ================================

    const handleEditEmployee = (employeeData) => {

        setEmployee({
            id: employeeData.id,
            name: employeeData.name || "",
            emailAddress: employeeData.emailAddress || "",
            department: employeeData.department || "",
            position: employeeData.position || "",
            dob: employeeData.dob
                ? employeeData.dob.substring(0, 10)
                : ""
        });

        setEditMode(true);
        setShowForm(true);

    };


    // ================================
    // DELETE EMPLOYEE
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

            console.error("Delete Error:", error);

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


    // ================================
    // EMPLOYEE NAME CLICK
    // ================================
const handleEmployeeClick = async (emp) => {

    console.log("Selected Employee:", emp);

    setSelectedEmployee(emp);
    setShowSalaryForm(false);
    setSalaryDetails([]);

    try {

        setSalaryLoading(true);

        const result = await getSalaryByEmployeeId(emp.id);

        console.log("Salary Result:", result);

        if (result?.data) {
            setSalaryDetails(result.data);
        } else {
            setSalaryDetails([]);
        }

    } catch (error) {

        console.error("Get Salary Error:", error);

        setSalaryDetails([]);

    } finally {

        setSalaryLoading(false);

    }
};


const handleSaveSalary = async () => {

    if (!selectedEmployee?.id) {
        alert("Employee not selected");
        return;
    }

    if (!salary.salaryMonth) {
        alert("Please select Salary Month");
        return;
    }

    try {

        const salaryData = {
            employeeId: selectedEmployee.id,
            salaryMonth: `${salary.salaryMonth}-01T00:00:00`,
            salaryDate: salary.salaryDate
                ? `${salary.salaryDate}T00:00:00`
                : null,
            paymentStatus: salary.paymentStatus || "Pending",
            remarks: salary.remarks || null
        };

        console.log("Salary Data:", salaryData);

        const result = await addSalary(salaryData);

        console.log("Add Salary Result:", result);

        alert(
            result?.message ||
            "Salary Added Successfully!"
        );

        setSalary({
            salaryMonth: "",
            salaryDate: "",
            paymentStatus: "Pending",
            remarks: ""
        });

        setShowSalaryForm(false);

        const salaryResult =
            await getSalaryByEmployeeId(
                selectedEmployee.id
            );

        if (salaryResult?.data) {
            setSalaryDetails(salaryResult.data);
        } else {
            setSalaryDetails([]);
        }

    } catch (error) {

        console.error(
            "Save Salary Error:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Unable to save salary"
        );
    }
};

    // ================================
    // CLOSE EMPLOYEE POPUP
    // ================================

    const handleClosePopup = () => {

        setSelectedEmployee(null);

        setShowSalaryForm(false);

    };


    // ================================
    // SALARY PAGE
    // ================================

    if (showSalary) {

        return (
            <Salary />
        );

    }


    return (

        <div className="dashboard">

            {/* ================= NAVBAR ================= */}

            <div className="navbar">

                <h2>MyFirstApi</h2>


                <button
                    className="secondary-button"
                    onClick={() => setShowSalary(true)}
                >
                    Salary
                </button>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>


            {/* ================= DASHBOARD ================= */}

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


                {/* ================= EMPLOYEE FORM ================= */}

                {showForm && (

                    <div className="employee-form">

                        <h2>

                            {editMode
                                ? "Update Employee"
                                : "Create Employee"
                            }

                        </h2>


                        <form onSubmit={handleSaveEmployee}>

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
                                        value={employee.emailAddress}
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
                                        value={employee.department}
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
                                        value={employee.position}
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
                                        value={employee.dob}
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


                {/* ================= EMPLOYEE LIST ================= */}

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

                                        <tr key={emp.id}>


                                            {/* EMPLOYEE NAME */}

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEmployeeClick(emp)
                                                    }
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        padding: 0,
                                                        color: "#007bff",
                                                        cursor: "pointer",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {emp.name}
                                                </button>

                                            </td>


                                            {/* EMAIL */}

                                            <td>
                                                {emp.emailAddress}
                                            </td>


                                            {/* DEPARTMENT */}

                                            <td>
                                                {emp.department}
                                            </td>


                                            {/* POSITION */}

                                            <td>
                                                {emp.position}
                                            </td>


                                            {/* DOB */}

                                            <td>
                                                {emp.dob}
                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditEmployee(emp)
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


            {/* ================================================= */}
            {/* EMPLOYEE DETAILS POPUP */}
            {/* ================================================= */}

            {selectedEmployee && (

                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                    }}
                    onClick={handleClosePopup}
                >


                    <div
                        style={{
                            background: "#fff",
                            width: "500px",
                            maxWidth: "90%",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* POPUP HEADER */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >

                            <h2>
                                Employee Details
                            </h2>


                            <button
                                type="button"
                                onClick={handleClosePopup}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "24px",
                                    cursor: "pointer"
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <hr />


                        {/* EMPLOYEE ID */}

                        {/* NAME */}
{/* 
                        <p>
                            <strong>
                                Name:
                            </strong>{" "}
                            {selectedEmployee.name}
                        </p> */}


                        {/* EMAIL */}

                        {/* <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {selectedEmployee.emailAddress}
                        </p> */}


                        {/* DEPARTMENT */}

                        {/* <p>
                            <strong>
                                Department:
                            </strong>{" "}
                            {selectedEmployee.department}
                        </p> */}


                        {/* POSITION */}

                        {/* <p>
                            <strong>
                                Position:
                            </strong>{" "}
                            {selectedEmployee.position}
                        </p> */}


                        {/* DOB */}

                        {/* <p>
                            <strong>
                                Date of Birth:
                            </strong>{" "}
                            {selectedEmployee.dob}
                        </p> */}


                        <hr />


                        {/* ================= SALARY SECTION ================= */}

         {!showSalaryForm ? (

    <div>

        <h3>Salary Details</h3>

        {salaryLoading ? (

            <p>Loading Salary Details...</p>

        ) : salaryDetails.length === 0 ? (

            <div>

                <p>No Salary Details Found</p>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowSalaryForm(true)}
                >
                    + Add Salary
                </button>

            </div>

        ) : (

            <div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "15px"
                    }}
                >

                    <thead>

                        <tr>

                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                                Salary Month
                            </th>

                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                                Salary Date
                            </th>

                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                                Payment Status
                            </th>

                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                                Remarks
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {salaryDetails.map((salary, index) => (

                            <tr key={index}>

                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {salary.salaryMonth
                                        ? new Date(
                                              salary.salaryMonth
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {salary.salaryDate
                                        ? new Date(
                                              salary.salaryDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {salary.paymentStatus || "-"}
                                </td>

                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {salary.remarks || "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <br />

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowSalaryForm(true)}
                >
                     Add Salary
                </button>

            </div>

        )}

    </div>
                        ) : (

                            <div>

                                <h3>
                                    Add Salary
                                </h3>


                                {/* SALARY MONTH */}

                                <div style={{ marginBottom: "15px" }}>

                                    <label>
                                        Salary Month
                                    </label>

                                    <input
    type="month"
    value={salary.salaryMonth}
    onChange={(e) =>
        setSalary({
            ...salary,
            salaryMonth: e.target.value
        })
    }
    style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px"
    }}
/>

                                </div>


                                {/* SALARY DATE */}

                                <div style={{ marginBottom: "15px" }}>

                                    <label>
                                        Salary Date
                                    </label>

                                    <input
    type="date"
    value={salary.salaryDate}
    onChange={(e) =>
        setSalary({
            ...salary,
            salaryDate: e.target.value
        })
    }
    style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px"
    }}
/>
                                </div>


                                {/* PAYMENT STATUS */}

                                <div style={{ marginBottom: "15px" }}>

                                    <label>
                                        Payment Status
                                    </label>

                                   <select
    value={salary.paymentStatus}
    onChange={(e) =>
        setSalary({
            ...salary,
            paymentStatus: e.target.value
        })
    }
>
    <option value="Pending">Pending</option>
    <option value="Paid">Paid</option>
</select>
                                </div>


                                {/* REMARKS */}

                                <div style={{ marginBottom: "15px" }}>

                                    <label>
                                        Remarks
                                    </label>

                                    <textarea
    value={salary.remarks}
    onChange={(e) =>
        setSalary({
            ...salary,
            remarks: e.target.value
        })
    }
    placeholder="Enter Remarks"
    rows="3"
    style={{
        width: "100%",
        padding: "10px",
        marginTop: "5px"
    }}
/>

                                </div>


                                {/* SAVE SALARY */}

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={handleSaveSalary}
                                       
                                    
                                >
                                    Save Salary
                                </button>


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowSalaryForm(false)
                                    }
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}


export default Dashboard;