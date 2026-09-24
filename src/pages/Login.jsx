import { useState } from "react";
import { loginUser } from "../services/authService";
import "../css/style.css";

function Login({ onLogin, onRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        if (!email || !password) {

            setError(
                "Please enter Email and Password"
            );

            return;
        }


        try {

            setLoading(true);


            const result = await loginUser(
                email,
                password
            );


            console.log(
                "Login Response:",
                result
            );


            if (result?.data?.token) {

                localStorage.setItem(
                    "token",
                    result.data.token
                );


                alert(
                    "Login Successful!"
                );


                onLogin();

            }
            else {

                setError(
                    result?.message ||
                    "Token not found"
                );

            }

        }
        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Login Failed!"
                );

            }
            else {

                setError(
                    "Unable to connect to API!"
                );

            }

        }
        finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-container">

            <div className="login-card">

                <h1>
                    MyFirstApi
                </h1>

                <h2>
                    Login
                </h2>


                {error && (

                    <div
                        style={{
                            color: "red",
                            background: "#fee2e2",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "15px"
                        }}
                    >
                        {error}
                    </div>

                )}


                <form onSubmit={handleLogin}>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >

                    <span>
                        Don't have an account?
                    </span>

                    <br />

                    <button
                        type="button"
                        className="secondary-button"
                        style={{
                            marginTop: "10px",
                            width: "100%"
                        }}
                        onClick={onRegister}
                    >
                        Create New Account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;