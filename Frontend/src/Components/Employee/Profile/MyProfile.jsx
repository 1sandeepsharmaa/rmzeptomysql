import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MyProfile() {
    var [load, setLoad] = useState(false)
    const [profile, setProfile] = useState([])
    var [name, setName] = useState("")
    var [contact, setContact] = useState("")
    var [experience, setExperience] = useState("")
    var [jobTitle, setJobTitle] = useState("")
    var [picture, setPicture] = useState("")
    var [linkedin, setLinkedin] = useState("")
    var [github, setGithub] = useState("")
    var [currentPassword, setCurrentPassword] = useState("")
    var [newPassword, setNewPassword] = useState("")
    var [confirmPassword, setConfirmPassword] = useState("")
    var [imagePreview, setImagePreview] = useState("")
    const id = sessionStorage.getItem("userId")
    const empId = sessionStorage.getItem("empId")
    var nav = useNavigate()

    useEffect(() => {
        setLoad(true)
        let data = {
            userId: id
        }
        ApiServices.GetAllEmployee(data)
            .then((res) => {
                setProfile(res?.data?.data[0])
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        let data1 = {
            _id: empId
        }
        ApiServices.GetSingleEmployee(data1)
            .then((res) => {
                if (res?.data?.success) {
                    setName(res?.data?.data?.name)
                    setContact(res?.data?.data?.contact)
                    setExperience(res?.data?.data?.experience)
                    setJobTitle(res?.data?.data?.jobTitle)
                    setPicture(res?.data?.data?.picture)
                    setImagePreview(res?.data?.data?.picture)
                    setLinkedin(res?.data?.data?.linkedin)
                    setGithub(res?.data?.data?.github)
                }
                else {
                    setTimeout(() => {
                        setLoad(false)
                    }, 1000)
                }
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        setLoad(false)
    }, [load])
    function logoutfun() {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Logout !!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Logout Successfully!",
                    text: "You have been redirected to the login page.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                sessionStorage.clear()
                nav("/")
            }
        });
    }
    function editProfile(e) {
        e.preventDefault()
        let data = new FormData()
        data.append("_id", empId)
        data.append("name", name)
        data.append("contact", contact)
        data.append("jobTitle", jobTitle)
        data.append("picture", picture)
        data.append("linkedin", linkedin)
        data.append("github", github)
        ApiServices.UpdateEmployee(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 2000)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 2000)
                }
            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 2000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 2000)
                console.log("Error is", err)
            })

    }
    function changePassword(e) {
        e.preventDefault()
        let data = {
            oldpassword: currentPassword,
            newpassword: newPassword,
            confirmpassword: confirmPassword
        }
        ApiServices.ChangePassword(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        setCurrentPassword("")
                        setNewPassword("")
                        setConfirmPassword("")
                    }, 2000)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 2000)
                }
            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 2000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 2000)
                console.log("Error is", err)
            })
    }
    function imageupload(e) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setPicture(e.target.files[0])
    }
    return (
        <>
            <main id="main">
                <EmployeePageTitle child="My Profile" />

                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>

                <section className="section profile">
                    <div className={load ? "display-screen" : ""}>

                        <div className="row">
                            <div className="col-xl-4">
                                <div className="card">
                                    <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                       <div
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                border: "3px solid #fff",
                                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#f0f0f0",
                                            }}
                                        >
                                            <img
                                                src={profile.picture || "/assets/img/admin_Profile.png"}
                                                alt="Profile"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                    display: "block",
                                                }}
                                            />
                                        </div>
                                        <h2 className="mt-3">{name}</h2>
                                        <h3 className="text-muted" style={{ fontSize: "1rem" }}>{jobTitle}</h3>
                                        <div className="social-links mt-3 d-flex justify-content-center gap-3">
                                            <Link to={profile.github} className="github text-decoration-none fs-4" style={{ color: "black" }}>
                                                <i className="bi bi-github" />
                                            </Link>
                                            <Link to={profile.linkedin} className="linkedin text-decoration-none text-primary fs-4">
                                                <i className="bi bi-linkedin" />
                                            </Link>
                                            <Link className="text-decoration-none fs-4" onClick={logoutfun} style={{ color: "grey" }}>
                                                <i class="bi bi-box-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-xl-8">
                                <div className="card">
                                    <div className="card-body pt-3">
                                        {/* Bordered Tabs */}
                                        <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link active"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-overview"
                                                    aria-selected="true"
                                                    role="tab"
                                                >
                                                    Overview
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-edit"
                                                    aria-selected="false"
                                                    role="tab"
                                                    tabIndex={-1}
                                                >
                                                    Edit Profile
                                                </button>
                                            </li>

                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#profile-change-password"
                                                    aria-selected="false"
                                                    role="tab"
                                                    tabIndex={-1}
                                                >
                                                    Change Password
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content pt-2">
                                            <div
                                                className="tab-pane fade profile-overview active show"
                                                id="profile-overview"
                                                role="tabpanel"
                                            >
                                                <h5 className="card-title">Profile Details</h5>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                    <div className="col-lg-9 col-md-8">{profile.name}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                                    <div className="col-lg-9 col-md-8">{profile.email}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Job Title</div>
                                                    <div className="col-lg-9 col-md-8">
                                                        {profile.jobTitle}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Joining Date</div>
                                                    <div className="col-lg-9 col-md-8">{profile.joiningDate}</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Contact</div>
                                                    <div className="col-lg-9 col-md-8">
                                                        {profile.contact}
                                                    </div>
                                                </div>
                                                {/* <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Experience</div>
                                                    <div className="col-lg-9 col-md-8">{profile.experience}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Total Coins</div>
                                                    <div className="col-lg-9 col-md-8">{profile.coins}</div>
                                                </div> */}
                                            </div>
                                            <div
                                                className="tab-pane fade profile-edit pt-3"
                                                id="profile-edit"
                                                role="tabpanel"
                                            >
                                                {/* Profile Edit Form */}
                                                <form onSubmit={editProfile}>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="profileImage"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Profile Image
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <img src={imagePreview} alt="Profile" />
                                                            <input
                                                                type="file"
                                                                id="fileInput"
                                                                style={{ display: "none" }}
                                                                onChange={imageupload}
                                                                accept="image/*"
                                                            />
                                                            <div className="pt-2">
                                                                <Link
                                                                    href="#"
                                                                    className="btn btn-primary btn-sm"
                                                                    title="Upload new profile image"
                                                                    onClick={() => document.getElementById("fileInput").click()}
                                                                >
                                                                    <i className="bi bi-upload" />
                                                                </Link>
                                                                <Link
                                                                    href="#"
                                                                    className="btn btn-danger btn-sm ms-2"
                                                                    title="Remove my profile image"
                                                                >
                                                                    <i className="bi bi-trash" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="Name"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Full Name
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="Name"
                                                                type="text"
                                                                className="form-control"
                                                                id="Name"
                                                                value={name} onChange={(e) => { setName(e.target.value) }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="JobTitle"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Job Title
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="jobTitle"
                                                                type="text"
                                                                className="form-control"
                                                                id="JobTitle"
                                                                value={jobTitle} onChange={(e) => { setJobTitle(e.target.value) }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="Contact"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Contact
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="contact"
                                                                type="text"
                                                                className="form-control"
                                                                id="Contact"
                                                                value={contact} onChange={(e) => { setContact(e.target.value) }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="row mb-3">
                                                        <label
                                                            htmlFor="Experience"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Experience
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="experience"
                                                                type="text"
                                                                className="form-control"
                                                                id="Experience"
                                                                value={experience} onChange={(e) => { setExperience(e.target.value) }}
                                                            />
                                                        </div>
                                                    </div> */}
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="github"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Github Profile
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="github"
                                                                type="text"
                                                                className="form-control"
                                                                id="github"
                                                                value={github ||"https://github.com/#"} onChange={(e) => { setGithub(e.target.value) }}
                                                                defaultValue="https://github.com/#"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="Linkedin"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Linkedin Profile
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="linkedin"
                                                                type="text"
                                                                className="form-control"
                                                                id="Linkedin"
                                                                value={linkedin || "https://linkedin.com/#"} onChange={(e) => { setLinkedin(e.target.value) }}
                                                                defaultValue="https://linkedin.com/#"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <button type="submit" style={{ background: "#6776f4", color: "white" }} className="btn ">
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </form>
                                                {/* End Profile Edit Form */}
                                            </div>

                                            <div
                                                className="tab-pane fade pt-3"
                                                id="profile-change-password"
                                                role="tabpanel"
                                            >
                                                {/* Change Password Form */}
                                                <form onSubmit={changePassword}>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="currentPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Current Password
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                className="form-control"
                                                                id="currentPassword"
                                                                value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value) }}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="newPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            New Password
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="newpassword"
                                                                type="password"
                                                                className="form-control"
                                                                id="newPassword"
                                                                value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <label
                                                            htmlFor="renewPassword"
                                                            className="col-md-4 col-lg-3 col-form-label"
                                                        >
                                                            Re-enter New Password
                                                        </label>
                                                        <div className="col-md-8 col-lg-9">
                                                            <input
                                                                name="renewpassword"
                                                                type="password"
                                                                className="form-control"
                                                                id="renewPassword"
                                                                value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <button type="submit" style={{ background: "#6776f4", color: "white" }} className="btn btn-primary">
                                                            Change Password
                                                        </button>
                                                    </div>
                                                </form>
                                                {/* End Change Password Form */}
                                            </div>
                                        </div>
                                        {/* End Bordered Tabs */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}