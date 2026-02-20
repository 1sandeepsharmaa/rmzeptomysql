import { ScaleLoader } from "react-spinners";
import { useEffect, useState } from "react";
import ApiServices from "../../../src/ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function FMProfile() {
  const [load, setLoad] = useState(false);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [designation, setDesignation] = useState("");

  const id = sessionStorage.getItem("userId");
  const empId = sessionStorage.getItem("empId");
  const nav = useNavigate();

  useEffect(() => {
    
    setLoad(true);

    ApiServices.GetSingleFm({ _id: empId})
      .then((res) => {
        if (res?.data?.success) {
          const data = res.data.data;
          setProfile(data);
          setName(data.name);
          setContact(data.contact);
          setDesignation(data.jobTitle);
        }
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }, [empId]);

  function logoutfun() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Logout?",
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

  function editProfile(e) {
    e.preventDefault();

    const data = {
      _id: empId,
      name,
      contact,
      jobTitle: designation,
    };

    setLoad(true);
    ApiServices.UpdateFm(data)
      .then((res) => {
        Swal.fire({
          icon: res.data.success ? "success" : "error",
          title: res.data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }

  return (
    <main id="main">
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      <section className="section profile">
        <div className={load ? "display-screen" : ""}>
          <div className="row">
            {/* LEFT CARD */}
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                  <img
                    src="/assets/img/admin_Profile.png"
                    alt="Profile"
                    className="rounded-circle"
                    width="120"
                  />
                  <h2 className="mt-3">{profile.name}</h2>
                  <h3 className="text-muted">{profile.jobTitle}</h3>

                  <button
                    className="btn btn-sm btn-outline-danger mt-3"
                    onClick={logoutfun}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="col-xl-8">
              <div className="card">
                <div className="card-body pt-3">
                  <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#overview"
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#edit"
                      >
                        Edit Profile
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content pt-3">
                    {/* OVERVIEW */}
                    <div
                      className="tab-pane fade show active"
                      id="overview"
                    >
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">ID</div>
                        <div className="col-md-8">{profile.empcode}</div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Name</div>
                        <div className="col-md-8">{profile.name}</div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Email</div>
                        <div className="col-md-8">{profile.email}</div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Contact</div>
                        <div className="col-md-8">{profile.contact}</div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Store</div>
                        <div className="col-md-8">{profile.store}</div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Designation</div>
                        <div className="col-md-8">{profile.jobTitle}</div>
                      </div>
                    </div>

                    {/* EDIT */}
                    <div className="tab-pane fade" id="edit">
                      <form onSubmit={editProfile}>
                        <div className="mb-3">
                          <label>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label>Contact</label>
                          <input
                            type="text"
                            className="form-control"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label>Designation</label>
                          <input
                            type="text"
                            className="form-control"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={profile.email || ""}
                            disabled
                          />
                        </div>

                        <div className="mb-3">
                          <label>Store</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profile.store || ""}
                            disabled
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn"
                          style={{ background: "#6776f4", color: "white" }}
                        >
                          Save Changes
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
