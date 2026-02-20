import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import Swal from 'sweetalert2';

export default function AdminHeader() {
    // const [showModal, setShowModal] = useState(false);
    const [load, setLoad] = useState(false)
    var [profile, setProfile] = useState([])
    // const handleShowModal = () => setShowModal(true);
    // const handleCloseModal = () => setShowModal(false);
    const nav = useNavigate()
    const addSidebar = () => {
        document.body.classList.toggle('toggle-sidebar');
    }
    // useEffect(() => {
    //     const id = sessionStorage.getItem("userId")
    //     let data = {
    //         _id: id
    //     }
    //     ApiServices.GetAllUser(data)
    //         .then((res) => {
    //             setProfile(res?.data?.data[0])
    //             sessionStorage.setItem("empId", res?.data?.data[0]?._id)
    //         })
    //         .catch((err) => {
    //             console.log("Error is ", err);
    //         })

    // }, [])
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
                    showConfirmButton: false, // Hides the "OK" button
                    timer: 1500
                });
                sessionStorage.clear()
                nav("/")
            }
        });
    }
    return (
        <>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-12">
                        <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                    </div>
                </div>
            </div>
            {/* ======= Header ======= */}
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <Link to="/admin" className="logo d-flex align-items-center ms-3">
                        <img src="/assets/img/logo4.png" alt="" />
                        <span className="d-lg-block" style={{ color: "#25353e" }}>R&M Tool</span>
                    </Link>
                    <i className="bi bi-list toggle-sidebar-btn" onClick={addSidebar} />

                </div>
                {/* End Logo */}

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item dropdown pe-3">
                            <Link
                                className="nav-link nav-profile d-flex align-items-center pe-0"
                                href="#"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src={profile.picture || "/assets/img/admin_Profile.png"}
                                    alt="Profile"
                                    className="rounded-circle profile-img"
                                />
                                <span className="d-none d-md-block dropdown-toggle ps-2">
                                    {profile?.name||"Admin"} 
                                </span>
                            </Link>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <img
                                        src={profile.picture || "/assets/img/admin_Profile.png"}
                                        alt="Profile"
                                        className="rounded-circle mb-2"
                                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                    />
                                    <h6>{profile?.name||"Admin"}</h6>
                                    <span>{profile?.jobTitle}</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item d-flex align-items-center"
                                        to="/admin/myProfile"
                                    >
                                        <i className="bi bi-person" />
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link onClick={logoutfun} className="dropdown-item d-flex align-items-center" >
                                        <i className="bi bi-box-arrow-right" />
                                        <span>Logout</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        {/* End Profile Dropdown Items */}
                        {/* End Profile Nav */}
                    </ul>
                </nav>

            </header>
            {/* End Header */}
        </>
    );
}