import { Link, useNavigate } from "react-router-dom"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useState } from "react"
import ApiServices from "../../../ApiServices"
import Swal from "sweetalert2"

export default function ManageCoins() {
    var [data, setData] = useState([])
    var [empData, setEmpData] = useState([])
    var [load, setLoad] = useState(true)
    var nav = useNavigate()
    const [progressFilter, setProgressFilter] = useState("");
    useEffect(() => {
        ApiServices.GetAllEmployee()
            .then((res) => {
                setEmpData(res?.data?.data)
            })
            .catch((err) => {
                console.log("Error is", err);
            })
        fetchTasks(progressFilter);
    }, [progressFilter])
    const fetchTasks = (filterValue = "") => {
        setLoad(true);
        console.log(filterValue);
        let data = {};
        if (filterValue !== "") {
            data.userId = filterValue;
        }
        ApiServices.GetAllCoin(data)
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

    function deleteCoin(id) {
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
                    text: "Coin has been deleted Successfully !!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                let data = {
                    _id: id
                }
                ApiServices.DeleteCoin(data)
                    .then((res) => {
                        setLoad(true)
                        if (res?.data?.success) {
                            setTimeout(() => {
                                setLoad(false)
                                nav("/admin/manageCoins")
                            }, 1000)
                        }
                        else {
                            setTimeout(() => {
                                setLoad(false)
                                nav("/admin/manageCoins")
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
                <PageTitle child="Manage Coins" />

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
                                <h4 className="fw-bold" style={{ color: "#012970" }}>Reward/Warning List</h4>
                            </div>
                            <div className="col-auto">
                                <label htmlFor="progressFilter" className="form-label fw-semibold me-2 mb-0" style={{ color: "#012970" }}>
                                    Filter by Employee :
                                </label>
                                <select
                                    id="progressFilter"
                                    className="form-select form-select-sm"
                                    style={{
                                        width: "180px",
                                        borderRadius: "6px",
                                        padding: "6px 10px",
                                        fontSize: "14px",

                                    }}
                                    value={progressFilter}
                                    onChange={(e) => handleProgressFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    {empData.map((el, index) => {
                                        return (
                                            <>
                                                <option value={el.userId}>{el.name}</option>

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
                                            <th>Employee Name</th>
                                            <th>Task</th>
                                            <th>Message</th>
                                            <th>Coins</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center text-muted">No Employees Found</td>
                                            </tr>
                                        ) :
                                            (
                                                data.map((el, index) => {
                                                    return (
                                                        <>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{el?.userId?.name}</td>
                                                                <td>{el?.taskId?.title}</td>
                                                                <td>{el?.message}</td>
                                                                <td>{el?.coinCount}</td>
                                                                <td>{el?.type}</td>
                                                                <td>{el?.status == true ? "true" : "false"}</td>
                                                                <td>
                                                                    <div className="btn-group">
                                                                        <Link to={"/admin/editCoins/" + el?._id} className="btn" style={{ background: '#197ce6ff', color: "white" }}>
                                                                            <i className="bi bi-pen"></i>
                                                                        </Link>
                                                                        <button onClick={() => { deleteCoin(el?._id) }} className="btn btn-danger ms-2">
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