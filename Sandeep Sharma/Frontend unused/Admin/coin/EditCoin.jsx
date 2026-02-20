import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function EditCoin() {
    var [employeeName, setEmployeeName] = useState("")
    var [employees, setEmployees] = useState([])
    var [employeeId, setEmployeeId] = useState("")

    var [taskName, setTaskName] = useState("")
    var [tasks, setTasks] = useState([])
    var [taskId, setTaskId] = useState("")

    var [message, setMessage] = useState("")
    var [coinCount, setCoinCount] = useState("")
    var [type, setType] = useState("")

    var [load, setLoad] = useState(false)
    var params = useParams()
    var nav = useNavigate()
    //category name getAll
    useEffect(() => {
        ApiServices.GetAllEmployee()
            .then((res) => {
                setEmployees(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllTask()
            .then((res) => {
                setTasks(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })

        let data = {
            _id: params.id
        }
        ApiServices.GetSingleCoin(data)
            .then((res) => {
                setLoad(true)
                setEmployeeName(res?.data?.data?.userId?.name)
                setEmployeeId(res?.data?.data?.userId)
                setTaskName(res?.data?.data?.taskId?.title)
                setTaskId(res?.data?.data?.taskId)
                setMessage(res?.data?.data?.message)
                setType(res?.data?.data?.type)
                setCoinCount(res?.data?.data?.coinCount)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
            .catch((err) => {
                console.log("Error is", err);
            })

    }, [])

    function handleForm(e) {
        e.preventDefault()
        let data = {
            _id: params.id,
            userId: employeeId,
            taskId: taskId,
            coinCount:coinCount,
            message: message,
            type: type
        }
        if (!employeeId) {
            toast.error("Please select a employee before submitting.")
            return;
        }
        if (!taskId) {
            toast.error("Please select a Task before submitting.")
            return;
        }
        ApiServices.UpdateCoin(data)
            .then((res) => {
                var message = res?.data?.message
                setLoad(true)
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
                        nav('/admin/manageCoins')
                    }, 2000)
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
                    }, 2000)
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
                <PageTitle child="Edit Coins" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>


                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Coin Details </h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>

                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Employee Name
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {employeeName || "Select a Employee"}
                                            </button>
                                            {employees?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {employees.length > 0 ? (
                                                                employees.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setEmployeeName(el.name);
                                                                                setEmployeeId(el.userId);
                                                                            }}
                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Employees found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Task Name
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {taskName || "Select a Task"}
                                            </button>
                                            {tasks?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {tasks.length > 0 ? (
                                                                tasks.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setTaskName(el.title);
                                                                                setTaskId(el._id);
                                                                            }}
                                                                        >
                                                                            {el.title}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Task found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">
                                            Message
                                        </label>
                                        <textarea type="text" className="form-control" id="inputNanme4" value={message} onChange={(e) => { setMessage(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Coin Count
                                        </label>
                                        <input type="number" className="form-control" id="inputNanme4" value={coinCount} onChange={(e) => { setCoinCount(e.target.value) }} required />
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label htmlFor="typeDropdown" className="form-label">
                                            Type
                                        </label>
                                        <div className="dropdown text-center">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="typeDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {type || "Select Type"}
                                            </button>
                                            <ul className="dropdown-menu w-100" aria-labelledby="typeDropdown">
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => setType("Reward")}
                                                    >
                                                        Reward
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => setType("Warning")}
                                                    >
                                                        Warning
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>


                                    <div className="text-center">
                                        <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
                                            Submit
                                        </button>

                                    </div>
                                </form>
                                {/* Vertical Form */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}