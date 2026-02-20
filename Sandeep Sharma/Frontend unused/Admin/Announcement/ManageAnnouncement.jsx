import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ApiServices from "../../../ApiServices"
import moment from "moment"

export default function ManageAnnouncement() {
    var [load, setLoad] = useState("")
    var [data, setData] = useState([])

    useEffect(() => {
        ApiServices.GetAllAnnouncement()
            .then((res) => {
                setData(res?.data?.data)

            })
            .catch((err) => {
                console.log("Error is", err);
            })
    }, [load])
    function deleteAnnouncement(id) {
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
                ApiServices.DeleteAnnouncement(data)
                    .then((res) => {
                        setLoad(true)
                        if (res?.data?.success) {
                            setTimeout(() => {
                                setLoad(false)
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
    return (
        <>
            <main className="main" id="main">
                <PageTitle child="Announcements" />

                {/* Loader */}
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "48%", marginTop: "20%" }} size={120} loading={load} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={load ? "display-screen" : ""}>
                    <div className="container-fluid">
                        {/* Header Row */}
                        <div className="row justify-content-end align-items-center mb-4">
                            <div className="col-auto">
                                <Link className="btn btn-primary shadow-sm" to={"/admin/addAnnouncement"} style={{ backgroundColor: "#6776f4", borderColor: "#6776f4" }}>
                                    + New Announcement
                                </Link>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="row">
                            <div className="col-lg-12 table-responsive">
                                <table className="table table-striped table-bordered table-hover align-middle shadow-sm rounded">
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col" className="text-center">S.No.</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Message</th>
                                            <th scope="col">Attachment</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Updated At</th>
                                            <th scope="col" className="text-center">Status</th>
                                            <th scope="col" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">No Announcement Found</td>
                                            </tr>
                                        ) :
                                            (
                                                data.map((el, index) => {
                                                    return (
                                                        <>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{el?.title}</td>
                                                                <td>{el?.message}</td>
                                                                <td>
                                                                    {el?.attachment ==true? (
                                                                        <Link to={el?.attachment} className="text-decoration-none fw-semibold text-primary">
                                                                            <i className="bi bi-file-earmark-text me-2"></i> View File
                                                                        </Link>
                                                                    ) : (
                                                                        <div className="text-muted d-flex align-items-center justify-content-center">
                                                                            <i className="bi bi-file-earmark-x me-2" style={{ fontSize: "1.2rem", color: "#b0b0b0" }}></i>
                                                                            <span style={{ fontStyle: "italic" }}>No Document Added</span>
                                                                        </div>
                                                                    )}

                                                                </td>
                                                                <td>{el?.createdAt?.split("T")[0]} {moment(el?.createdAt).format('hh:mm A')}</td>
                                                                <td>{el?.updatedAt?.split("T")[0]} {moment(el?.updatedAt).format('hh:mm A')}</td>
                                                                <td>{el?.status == true ? "true" : "false"}</td>
                                                                <td>
                                                                    <div className="btn-group">
                                                                        <Link to={"/admin/editAnnouncement/" + el?._id} className="btn" style={{ background: '#197ce6ff', color: "white" }}>
                                                                            <i className="bi bi-pen"></i>
                                                                        </Link>
                                                                        <button onClick={() => { deleteAnnouncement(el?._id) }} className="btn btn-danger ms-2">
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

        </>
    )
}