import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ViewProgress() {
    var [data, setData] = useState([])
    var [load, setLoad] = useState(true)
    var [progressFilter, setProgressFilter] = useState("");
    var [projects, setProejcts] = useState([])
    useEffect(() => {
        fetchTasks(progressFilter);
    }, [progressFilter])

    const fetchTasks = (filterValue = "") => {
        setLoad(true);
        let data = {};
        if (filterValue !== "") {
            data.projectId = filterValue;
        }
        ApiServices.GetAllTask(data)
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data || []);
                } else {
                    setData([]);
                }
                setLoad(false);
            })
            .catch((err) => {
                console.log("Error:", err);
                setLoad(false);
            });
    };
    const handleProgressFilter = (value) => {
        setProgressFilter(value);
        fetchTasks(value);
    };
    useEffect(() => {
        ApiServices.GetAllProject()
            .then((res) => {
                setProejcts(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
    }, [])
    return (
        <>
            <main className="main" id="main">
                <PageTitle child="View Progress" />

                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>
                    <div className="container-fluid">
                        <div className="row justify-content-between align-items-center mb-3">
                            <div className="col-auto">
                                <h4 className="fw-bold" style={{ color: "#012970" }}>Task List</h4>
                            </div>
                            <div className="col-auto">
                                <label htmlFor="progressFilter" style={{ color: "#012970" }} className="form-label fw-semibold me-2 mb-0">
                                    Filter by Projects :
                                </label>
                                <select
                                    id="progressFilter"
                                    className="form-select form-select-sm"
                                    style={{
                                        width: "180px",
                                        borderRadius: "6px",
                                        padding: "6px 10px",
                                        fontSize: "14px"
                                    }}
                                    value={progressFilter}
                                    onChange={(e) => handleProgressFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {projects?.map((el, index) => {
                                        return (
                                            <>
                                                <option value={el._id}>{el.name}</option>

                                            </>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Table starts here */}
                        <div className="row">
                            <div className="col-lg-12 table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Project Name</th>
                                            <th>Employee Name</th>
                                            <th>Technology </th>
                                            <th>Deadline</th>
                                            <th>Progress</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center text-muted">No Tasks Found</td>
                                            </tr>
                                        ) : (
                                            data.map((el, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{el?.title}</td>
                                                    <td>{el?.description}</td>
                                                    <td>{el?.projectId?.name}</td>
                                                    <td>{el?.employeeId?.name}</td>
                                                    <td>{el?.subCategoryId?.name}</td>
                                                    <td>{el?.deadline}</td>
                                                    <td>{el?.progress}</td>
                                                    <td>{el?.status ? "true" : "false"}</td>
                                                    <td>
                                                        {el?.progress == "Completed" ? (
                                                            <>
                                                                {el?.status ?
                                                                    <div className="btn-group">
                                                                        <Link to={"/admin/viewSubmitTask/" + el?._id} >
                                                                            {/* View */}
                                                                        <span class="badge text-bg-primary">View</span>
                                                                        </Link>
                                                                    </div>
                                                                    :
                                                                    <div className="btn-group">
                                                                        {/* <Link className="btn btn-success" style={{ background: "#007bff" }}>
                                                                            Done
                                                                        </Link> */}
                                                                        <span class="badge text-bg-success">Done</span>
                                                                    </div>
                                                                }
                                                            </>
                                                        )
                                                            :
                                                            (
                                                                <div className="btn-group">
                                                                    <span class="badge text-bg-danger">Pending</span>
                                                                </div>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            ))
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