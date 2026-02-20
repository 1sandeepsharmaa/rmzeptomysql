import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiServices from '../../ApiServices';
import moment from 'moment';

export default function PRPOHeader() {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState([]);

  /* 🔔 Notification states */
  const [showNotifyPanel, setShowNotifyPanel] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedNotify, setSelectedNotify] = useState(null);

  const nav = useNavigate();
  // const unreadCount = data.length;

  const addSidebar = () => document.body.classList.toggle('toggle-sidebar');

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    const userType = sessionStorage.getItem("userType");
    if (!id) return;

    const requestData = { userId: id };
    let apiCall;

    if (userType == "3") apiCall = ApiServices.GetAllFm;
    if (userType == "4") apiCall = ApiServices.GetAllClm;
    if (userType == "5") apiCall = ApiServices.GetAllZh;
    if (userType == "6") apiCall = ApiServices.GetAllBf;
    if (userType == "7") apiCall = ApiServices.GetAllProcurement;
    if (userType == "8") apiCall = ApiServices.GetAllPrPo;
    if (userType == "9") apiCall = ApiServices.GetAllZonalCommercial;
    if (userType == "10") apiCall = ApiServices.GetAllMissingBridge;

    apiCall(requestData)
      .then((res) => {
        const empProfile = res?.data?.data[0] || null;
        setProfile(empProfile);
        if (empProfile?._id) sessionStorage.setItem("empId", empProfile._id);
      })
      .catch(() => {});

    /* 🔔 Dummy announcements (replace with API later) */
    setData([
      {
        title: "New Announcement",
        message: "New policy update released.",
        createdAt: new Date()
      },
      {
        title: "Meeting Reminder",
        message: "Monthly meeting at 4 PM.",
        createdAt: new Date()
      }
    ]);
  }, []);

  function logoutfun() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        nav("/");
      }
    });
  }

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-start">
          <Link to="/PR_PO" className="logo d-flex align-items-center ms-3">
            <img src="/assets/img/logo4.png" alt="Logo" />
            <span className="d-lg-block" style={{ color: "#25353e" }}>
              R&M Tool
            </span>
          </Link>
          <i className="bi bi-list toggle-sidebar-btn" onClick={addSidebar} />
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">

            {/* 🔔 NOTIFICATION BELL (PROFILE SE PEHLE)
            <li className="nav-item pe-3">
              <span
                className="nav-link position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => setShowNotifyPanel(true)}
              >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                  <span className="notify-badge">{unreadCount}</span>
                )}
              </span>
            </li> */}

            {/* 👤 PROFILE */}
            <li className="nav-item dropdown pe-3">
              <Link
                className="nav-link nav-profile d-flex align-items-center pe-0"
                data-bs-toggle="dropdown"
              >
                <img
                  src={profile?.picture || "/assets/img/admin_Profile.png"}
                  className="rounded-circle profile-img"
                />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {profile?.name || "PR/PO"}
                </span>
              </Link>

              <ul className="dropdown-menu dropdown-menu-end profile">
                <li className="dropdown-header text-center">
                  <h6>{profile?.name || "Clm"}</h6>
                  <span>{profile?.jobTitle || ""}</span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {/* <li>
                  <Link to="/PR_PO/prprprofile" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-person" />
                    <span>My Profile</span>
                  </Link>
                </li> */}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <span onClick={logoutfun} className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-box-arrow-right" />
                    <span>Logout</span>
                  </span>
                </li>
              </ul>
            </li>

          </ul>
        </nav>
      </header>

      {/* 👉 RIGHT SIDE NOTIFICATION PANEL */}
      {showNotifyPanel && (
        <div className="notification-panel">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Announcements</h5>
            <i
              className="bi bi-x-lg"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNotifyPanel(false)}
            ></i>
          </div>

          <ul className="list-group list-group-flush">
            {data.map((el, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedNotify(el);
                  setShowNotifyModal(true);
                }}
              >
                <strong>{el.title}</strong>
                <p className="mb-0 small text-muted">
                  {moment(el.createdAt).fromNow()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 👉 MODAL + BLUR */}
      {showNotifyModal && (
        <>
          <div className="blur-overlay"></div>
          <div className="notify-modal">
            <h5>{selectedNotify?.title}</h5>
            <p className="mt-3">{selectedNotify?.message}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setShowNotifyModal(false)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
}
