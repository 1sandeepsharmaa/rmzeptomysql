import { useState } from "react";
import ApiServices from "../ApiServices";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [load, setLoad] = useState(false);
    const nav = useNavigate();

    function handleForm(e) {
        e.preventDefault();

        let data = {
            email: email,
            password: password,
        };

        ApiServices.Login(data)
            .then((res) => {
                if (res.data.success) {
                    const name = res?.data?.data?.name;
                    Swal.fire({
                        title: "Login Successfully !!",
                        text: "Welcome back " + name + " !!",
                        icon: "success",
                        confirmButtonColor: "#6776f4",
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setLoad(true);
                    sessionStorage.setItem("token", res?.data?.token);
                    sessionStorage.setItem("userId", res?.data?.data?._id);
                    localStorage.setItem("userId", res?.data?.data?._id);
                    sessionStorage.setItem("name", res?.data?.data?.name);
                    sessionStorage.setItem("email", res?.data?.data?.email);
                    sessionStorage.setItem("userType", res?.data?.data?.userType);

                    setTimeout(() => {
                        nav("/redirect");  
                    }, 1000);
                } else {
                    Swal.fire({
                        title: "Login Failed",
                        text: "Invalid email or password!",
                        icon: "error",
                        confirmButtonText: "Try Again",
                    });
                }
            })
            .catch((err) => {
                Swal.fire({
                    title: "Something Went Wrong !!",
                    text: "Please Try Again After Sometime",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
                console.error("Error:", err);
            });
    }

    return (
        <>
            {/* Loading Spinner */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <ScaleLoader
                            color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                    </div>
                </div>
            </div>

            {!load ? (
                <>
                    <div className="auth-wrapper d-flex justify-content-center align-items-center position-relative" style={{ cursor: "default" }}>
                        <div
                            className="auth-box d-flex justify-content-center align-items-center position-relative"
                            style={{
                                boxShadow: "0 8px 32px 0 rgba(39,44,63,.2)",
                                borderRadius: "20px",
                                minWidth: "300px", // Keep a minimum width for smaller screens
                                maxWidth: "500px", // Max width for larger screens
                                padding: "2rem", // Space inside the box
                                zIndex: 20,
                                backgroundColor: "white",
                            }}
                        >
                            <div className="col-lg-12 bg-white p-4" style={{ borderRadius: 20 }}>
                                <div className="text-center mb-4">
                                    <img src="../assets/img/user 1.png" alt="no-image"
                                        style={{ height: "90px" }}
                                    />
                                </div>
                                <h2 className="text-center" style={{ color: "#6776f4", fontWeight: 700 }}>
                                    Sign In
                                </h2>
                                <form onSubmit={handleForm}>
                                    <div className="form-group mb-3">
                                        <label className="form-label text-dark">Email</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            placeholder="Enter your Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{ borderRadius: "10px" }}
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="form-label text-dark" htmlFor="pwd">
                                            Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                className="form-control pe-5"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                style={{ borderRadius: "10px" }}
                                            />
                                            <span
                                                className="password-toggle-icon"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    right: "15px",
                                                    transform: "translateY(-50%)",
                                                    cursor: "pointer",
                                                    color: "#999",
                                                }}
                                            >
                                                <i className={showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}></i>
                                            </span>
                                        </div>

                                    </div>

                                    <div className="text-center mt-2">
                                        <button
                                            type="submit"
                                            className="btn w-100"
                                            style={{
                                                background: "#6776f4",
                                                color: "white",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            Sign In
                                        </button>
                                    </div>

                                    <div className="text-center mt-4" >
                                        Welcome to <b>R&M Tool, </b>
                                        Contact Admin For password reset
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            minHeight: "100vh",
                            backgroundImage: "url('../assets/img/background_login.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(12px)",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                    </div >
                </>
            ) : (
                ""
            )
            }
        </>
    );
}













