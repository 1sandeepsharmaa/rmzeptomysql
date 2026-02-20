import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageTask() {
    var [data, setData] = useState([])
    var [load, setLoad] = useState(true)

    useEffect(() => {
        ApiServices.GetAllTask()
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

    function deleteTask(id) {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Delete !!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Task has been deleted Successfully !!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                let data = {
                    _id: id
                }
                ApiServices.DeleteTask(data)
                    .then((res) => {
                        setLoad(true)
                        if (res?.data?.success) {
                            setTimeout(() => {
                                setLoad(false)
                                nav("/admin/manageTask")
                            }, 1000)
                        }
                        else {
                            toast.error(res?.data?.message)
                            setTimeout(() => {
                                setLoad(false)
                                nav("/admin/manageTask")
                            }, 1000)
                        }
                    })
                    .catch((err) => {
                        console.log("Error is ", err);

                    })
            }
        });
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
                <PageTitle child="Manage Task" />

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
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Attachment</th>
                                            <th>Project Name</th>
                                            <th>Employee Name</th>
                                            <th>Technology</th>
                                            <th>Deadline</th>
                                            <th>Progress</th>
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
                                                        <td>{el?.title}</td>
                                                        <td>{el?.description}</td>
                                                        {/* <td><img src={el?.attachment} alt="No File" height="50px" width="50px" /></td> */}
                                                        <td>
                                                            {fileType == "document" ?
                                                                <Link to={el?.attachment} rel="noopener noreferrer">
                                                                    <i className="bi bi-file-earmark-fill fs-1" src={el?.attachment} alt="No Document found" />
                                                                    <span>(.{ext})</span>
                                                                </Link>
                                                                :
                                                                <img src={el?.attachment} alt="No Document found" style={{ width: 100, height: 120 }} />}

                                                        </td>
                                                        <td>{el?.projectId?.name}</td>
                                                        <td>{el?.employeeId?.name}</td>
                                                        <td>{el?.subCategoryId?.name}</td>
                                                        <td>{el?.deadline}</td>
                                                        <td>{el?.progress}</td>
                                                        <td>{el?.status == true ? "true" : "false"}</td>
                                                        <td>
                                                            <div className="btn-group">
                                                                 <Link to={"/admin/editTask/" + el?._id} className="btn" style={{ background: '#197ce6ff', color: "white" }}>
                                                                    <i className="bi bi-pen"></i>
                                                                </Link>
                                                                <button onClick={() => { deleteTask(el?._id) }} className="btn btn-danger ms-2">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
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