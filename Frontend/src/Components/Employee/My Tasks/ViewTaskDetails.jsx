import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function ViewTaskDetails() {
    var [load, setLoad] = useState(false)
    var [data, setData] = useState({})
    var [progress, setProgress] = useState("")
    const [showSave, setShowSave] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [attachment, setAttachment] = useState("")
    var nav = useNavigate()
    var params = useParams()
    useEffect(() => {
        let data = {
            _id: params.id
        }
        ApiServices.GetSingleTask(data)
            .then((res) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                setData(res?.data?.data)
                setProgress(data?.progress);
            })
            .catch((err) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                console.log("Error is", err);
            })
    }, [params.id])

    function handleProgress(progress) {
        setProgress(progress)
        if (progress === "Completed") {
            setShowUpload(true);
            setShowSave(false);
        } else {
            setShowUpload(false);
            setShowSave(true);
        }
    }

    function updateProgress(e) {
        e.preventDefault()
        let data = {
            _id: params.id,
            progress: progress
        }
        ApiServices.UpdateTask(data)
            .then((res) => {
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
                        nav("/employee/myTasks")
                    }, 1000)
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
                    }, 1000)
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
                console.log("Error is ", err);

            })
    }

    function submitTask(e) {
        e.preventDefault()
        let data1 = new FormData()
        data1.append("taskId", params.id)
        data1.append("file", attachment)
        if (!attachment) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a file before submitting. ",
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }
        ApiServices.AddSubmit(data1)
            .then((res) => {
                setLoad(true)
                var message1 = res?.data?.message
                if (res?.data?.success) {
                    let data = {
                        _id: params.id,
                        progress: progress
                    }
                    ApiServices.UpdateTask(data)
                        .then((res) => {
                            var message = res?.data?.message
                            if (res?.data?.success) {
                                Swal.fire({
                                    title: message1,
                                    icon: "success",
                                    draggable: true,
                                    confirmButtonText: 'Continue',
                                    timer: 2000,
                                    timerProgressBar: true,
                                });
                                setTimeout(() => {
                                    setLoad(false)
                                    nav("/employee/myTasks")
                                }, 1000)
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
                                }, 1000)
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
                            console.log("Error is ", err);

                        })
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message1,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 1000)
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
                console.log("Error is ", err);
            })

    }
    return (
        <>
            <main id="main" className="main">
                <EmployeePageTitle child="Task Details" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mt-5 table-responsive">
                            {!load ?
                                <>
                                    <h2 style={{ color: "#012970" }}><strong>Overview</strong></h2>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title"><strong> {data?.title}</strong></h5>

                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Description :</strong> {data?.description}</h5>

                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Deadline :</strong> {data?.deadline}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Attachment :</strong>{data?.attachment ? <Link to={data?.projectId?.attachment} >
                                                <i className="bi bi-file-earmark-fill fs-1" alt="No Document found" />
                                                Click to open
                                            </Link> : "No Document Found"}
                                            </h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Status :</strong> {data?.projectId?.status == true ? "true" : "false"}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Start Date :</strong> {data?.createdAt?.split("T")[0]}</h5>

                                            <div className="d-flex align-items-center mb-3">
                                                <h5 className="me-2 mb-0" style={{ color: "#012970" }}>
                                                    <strong>Progress :</strong>
                                                </h5>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-primary dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        {progress || data?.progress}
                                                    </button>
                                                    <ul className="dropdown-menu shadow rounded-3 mt-2">
                                                        <li>
                                                            <Link className="dropdown-item text-dark" onClick={() => handleProgress("Not Started")} to="#">
                                                                Not Started
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item text-dark" onClick={() => handleProgress("In Progress")} to="#">
                                                                In Progress
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item text-dark" onClick={() => handleProgress("Completed")} to="#">
                                                                Completed
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            {showSave == true ? (
                                                <div className="text-center">
                                                    <button type="button" className="btn" onClick={updateProgress} style={{ background: "#6776f4", color: "white" }}>
                                                        Save
                                                    </button>

                                                </div>
                                            ) : (
                                                <>
                                                    <div className="col-12 mt-3">
                                                        <label className="form-label">
                                                            <strong>Attachment</strong>
                                                        </label>
                                                        <input type="file" className="form-control" id="inputEmail4" onChange={(e) => { setAttachment(e.target.files[0]) }} />
                                                    </div>
                                                    <div className="text-center mt-3">
                                                        <button type="button" onClick={submitTask} className="btn" style={{ background: "#6776f4", color: "white" }}>
                                                            Submit
                                                        </button>

                                                    </div>
                                                </>
                                            )}


                                        </div>
                                    </div>


                                </>
                                : ""}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}