import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApiServices from "../../../ApiServices";

export default function ViewSubmitTask() {
    var [load, setLoad] = useState(false)
    var [data, setData] = useState([])
    var[submitId,setSubmitId]=useState("")
    var params = useParams()
    var nav=useNavigate()
    useEffect(() => {
        let data = {
            taskId: params.id
        }
        ApiServices.GetAllSubmit(data)
            .then((res) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                setData(res?.data?.data[0])
                setSubmitId(res?.data?.data[0]?._id)
            })
            .catch((err) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                console.log("Error is", err);
            })
    }, [])
    function approveTask(e) {
        e.preventDefault()
        let data = {
            _id:submitId,
            status: "false"
        }
        ApiServices.ChangeStatusSubmit(data)
            .then((res) => {
                setLoad(true)
                var message1 = res?.data?.message
                if (res?.data?.success) {
                    let data1={
                        _id:params.id,
                        status:"false"
                    }
                    ApiServices.ChangeStatusTask(data1)
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
                                    nav("/admin/viewProgress")
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
                    console.log("Status is required");
                    
                    setTimeout(() => {
                        setLoad(false)
                    }, 1000)
                }
            })
    }
    return (
        <>
            <main className="main" id="main">
                <PageTitle child="View Submit Task" />

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
                                            <h5 className="card-title"><strong> {data?.taskId?.title}</strong></h5>

                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Description :</strong> {data?.taskId?.description}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Start Date :</strong> {data?.taskId?.createdAt?.split("T")[0]}</h5>

                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Deadline :</strong> {data?.taskId?.deadline}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Attachment :</strong>{data?.file ? <Link to={data?.file} target="_blank" >
                                                <i className="bi bi-file-earmark-fill fs-1" alt="No Document found" />
                                                Click to open
                                            </Link> : "No Document Found"}
                                            </h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Status :</strong> {data?.status == true ? "true" : "false"}</h5>
                                            <div className="text-center mt-3">
                                                <button type="button" onClick={approveTask} className="btn" style={{ background: "#6776f4", color: "white" }}>
                                                    Approve
                                                </button>
                                            </div>
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