import { Link, useNavigate } from "react-router-dom"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useState } from "react"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function ManageProjectTeam() {
    var [data, setData] = useState([])
    var [load, setLoad] = useState(true)
    var nav = useNavigate()
    useEffect(() => {
        ApiServices.GetAllProjectTeam()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data)
                }
                else {
                    setData([])
                }
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            })
            .catch((err) => {
                toast.error("Something Went Wrong")
                console.log("Error is ", err);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
    }, [load])

    function changeInactiveStatus(id) {
        Swal.fire({
            title: "Confirm Status Change",
            text: "Are you sure you want to change the status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    let data = {
                        _id: id,
                        status: "false"
                    }
                    ApiServices.ChangeStatusProjectTeam(data)
                        .then((res) => {
                            setLoad(true)
                            var message = res?.data?.message
                            if (res.data.success) {
                                Swal.fire({
                                    title: message,
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                setTimeout(() => {
                                    setLoad(false)
                                }, 1500)
                            }
                            else {
                                Swal.fire({
                                    title: message,
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                setTimeout(() => {
                                    setLoad(false)
                                }, 1500)
                            }
                        })
                        .catch((err) => {
                            setLoad(true)
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Something went wrong!",
                                timer: 2000,
                                timerProgressBar: true,
                            });
                            setTimeout(() => {
                                setLoad(false)
                            }, 2000)
                            console.log("Error is", err);
                        })
                }
            })


    }

    function changeActiveStatus(id) {
        Swal.fire({
            title: "Confirm Status Change",
            text: "Are you sure you want to change the status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        })
            .then((result) => {
                if (result.isConfirmed) {

                    let data = {
                        _id: id,
                        status: true
                    }
                    ApiServices.ChangeStatusProjectTeam(data)
                        .then((res) => {
                            setLoad(true)
                            var message = res?.data?.message
                            if (res.data.success) {
                                Swal.fire({
                                    title: message,
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                setTimeout(() => {
                                    setLoad(false)
                                }, 1500)
                            }
                            else {
                                Swal.fire({
                                    title: message,
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                setTimeout(() => {
                                    setLoad(false)
                                }, 1500)
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
                            console.log("Error is", err);
                        })
                }
            })
    }
    let ext;
    function getFileType(fileName) {
        if (!fileName) {
            return "other";
        }
        ext = fileName.split('.').pop().toLowerCase();
        if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "bmp" || ext == "webp" || ext == "svg" || ext == "ico") {
            return "image"
        }
        if (ext === "pdf" || ext === "zip" || ext === "doc" || ext === "docx" || ext === "xls" || ext === "xlsx" || ext === "ppt" || ext === "pptx" || ext === "txt" || ext === "rtf") {
            return "document";
        }
    }
    return (
        <>
            <main className="main" id="main">
                <PageTitle child="Manage Project Team" />

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
                                    <div className="row row-cols-1 row-cols-md-3 g-4">
                                        {data?.map((el, index) => {
                                            const fileType = getFileType(el?.attachment)

                                            return (
                                                < >
                                                    <div key={index} className="col">
                                                        <div className="card h-100">
                                                            {fileType == "document" ?
                                                                <Link to={el?.projectId?.attachment} rel="">
                                                                    <i className="bi bi-file-earmark-fill fs-1" src={el?.projectId?.attachment} alt="No Document found" />
                                                                    <span>(.{ext})</span>
                                                                </Link>
                                                                :
                                                                <img className="card-img-top img-fluid" src={el?.projectId?.attachment} alt="No Document found" />}
                                                            <div className="card-body">
                                                                <h5 className="card-title">{el?.projectId?.name}</h5>
                                                                <p lassName="card-text"> <strong>Project Technology :</strong> {el?.projectId?.technology} </p>
                                                                <p lassName="card-text"> <strong>Project Client :</strong> {el?.projectId?.client} </p>
                                                                <p lassName="card-text"> <strong>Project Team :</strong> </p>
                                                                {/* <p className="card-text">
                                                                    This is a wider card with supporting text below as a natural lead-in
                                                                    to additional content. This card has even longer content than the
                                                                    first to show that equal height action.
                                                                </p> */}
                                                                <ul>
                                                                    {el.employeeId?.map((emp, i) => {
                                                                        return (
                                                                            <>
                                                                                <li key={i}>{emp?.name || emp}</li>
                                                                            </>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            </div>
                                                            <div className="card-footer">
                                                                <Link to={"/admin/editProjectTeam/" + el?._id} className="btn" style={{ background: '#197ce6ff', color: "white" }}>
                                                                    <i className="bi bi-pen"></i>
                                                                </Link>
                                                                {
                                                                    el.status ?
                                                                        <>
                                                                            <Link className="btn ms-2" style={{ background: "#6c757d", color: "white" }} onClick={() => { changeInactiveStatus(el._id) }}>
                                                                                <i className="bi bi-x-circle " ></i>
                                                                                {/* Inactive  */}
                                                                            </Link>
                                                                        </>
                                                                        :
                                                                        <Link className="btn btn-success ms-2" onClick={() => { changeActiveStatus(el._id) }}>
                                                                            <i className="bi bi-check-circle"></i>
                                                                            {/* Active */}
                                                                        </Link>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
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