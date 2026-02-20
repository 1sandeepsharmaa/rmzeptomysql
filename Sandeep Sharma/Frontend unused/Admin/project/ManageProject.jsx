import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageProject() {
    var [data, setData] = useState([])
    var [load, setLoad] = useState(true)

    useEffect(() => {
        ApiServices.GetAllProject()
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
                        ApiServices.ChangeStatusProject(data)
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
                        ApiServices.ChangeStatusProject(data)
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
    const getDownloadUrl = (url) => {
        if (!url) return "";
        return url.replace("/image/upload/", "/image/upload/fl_attachment/");
    };


    return (
        <>
            <main className="main" id="main">
                <PageTitle child="Manage Project" />

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
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Proejct Name</th>
                                            <th>Description</th>
                                            <th>Attachment</th>
                                            <th>Client</th>
                                            <th>Department</th>
                                            <th>Technology</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((el, index) => {
                                            const fileType = getFileType(el?.attachment)
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{el?.name}</td>
                                                        <td>{el?.description}</td>
                                                        {/* <td><img src={el?.attachment} alt="No File" height="50px" width="50px" /></td> */}
                                                        <td>
                                                            {fileType == "document" ? (
                                                                <a href={getDownloadUrl(el?.attachment)} download target="_blank" rel="noopener noreferrer">
                                                                    <i className="bi bi-file-earmark-fill fs-1" />
                                                                    <span>(.{ext})</span>
                                                                </a>
                                                            ) : (
                                                                <a href={el?.attachment} download target="_blank" rel="noopener noreferrer">
                                                                    <img src={el?.attachment} alt="No Document found" style={{ width: 100, height: 120 }} />
                                                                </a>
                                                            )}

                                                        </td>
                                                        <td>{el?.client}</td>
                                                        <td>{el?.categoryId?.name}</td>
                                                        <td>{el?.subCategoryId?.name}</td>
                                                        <td>{el?.status == true ? "true" : "false"}</td>
                                                        <td>
                                                            <div className="btn-group">
                                                                <Link to={"/admin/editPrpject/" + el?._id} className="btn" style={{ background: '#197ce6ff', color: "white" }}>
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
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                : ""}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}