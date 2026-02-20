import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import ApiServices from "../../../ApiServices"
import Swal from "sweetalert2"
import { useNavigate, useParams } from "react-router-dom"


export default function EditProjectTeam() {
    var [projectName, setProjectName] = useState("")
    var [projects, setProejcts] = useState([])
    var [projectId, setProjectId] = useState("")
    var [employeeName, setEmployeeName] = useState([])
    var [employees, setEmployees] = useState([])
    var [employeeId, setEmployeeId] = useState("")
    var [selectedEmployees, setSelectedEmployees] = useState([])
    var [load, setLoad] = useState(false)
    var params = useParams()
    var nav=useNavigate()
    useEffect(() => {
        ApiServices.GetAllProject()
            .then((res) => {
                setProejcts(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllEmployee()
            .then((res) => {
                setEmployees(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })

        let data = {
            _id: params.id
        }
        ApiServices.GetSingleProjectTeam(data)
            .then((res) => {
               console.log(res?.data?.data);
               setProjectId(res?.data?.data?.projectId?._id)
               setProjectName(res?.data?.data?.projectId?.name)
               setSelectedEmployees(res?.data?.data?.employeeId?.map(emp => emp._id)||[])
               setEmployeeName(res?.data?.data?.employeeId?.map(emp => emp.name)||[])
               
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
    }, [])

    function handleForm(e) {
        e.preventDefault()
        let data = {
            _id:params.id,
            projectId: projectId,
            employeeId: selectedEmployees
        }
        if (!projectId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a Project before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        if (setEmployees.length == 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a Employee before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        ApiServices.UpdateProjectTeam(data)
            .then((res) => {
                setLoad(true)
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
                        nav("/admin/manageProjectTeam")
                        setLoad(false)
                        setProjectName("")
                        setProjectId("")
                        setEmployeeName("")
                        setEmployeeId("")
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
                <PageTitle child="Edit Project Team" />
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
                                <h5 className="card-title">Project Team Details</h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Project Name
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {projectName || "Select a Project"}
                                            </button>
                                            {projects?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {projects.length > 0 ? (
                                                                projects.map((el) => (
                                                                    <li key={el?._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setProjectName(el?.name);
                                                                                setProjectId(el?._id);
                                                                            }}

                                                                        >
                                                                            {el?.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Projects found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* <div className="col-12">
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
                                                                    <li key={el?._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setEmployeeName(el?.name);
                                                                                setEmployeeId(el?._id);
                                                                            }}

                                                                        >
                                                                            {el?.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Projects found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div> */}
                                    <div className="col-12">
                                        <label htmlFor="employeeDropdown" className="form-label">
                                            Employee Name
                                        </label>
                                        <div className="dropdown">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="employeeDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                style={{ whiteSpace: "normal", overflow: "hidden" }}
                                            >
                                                {employeeName.length > 0
                                                    ? employeeName.join(", ")
                                                    : "Select Employees"}
                                            </button>

                                            <ul
                                                className="dropdown-menu w-100"
                                                aria-labelledby="employeeDropdown"
                                                style={{ maxHeight: "200px", overflowY: "auto" }}
                                            >
                                                {employees.length > 0 ? (
                                                    employees.map((el) => (
                                                        <li key={el._id}>
                                                            <button
                                                                type="button"
                                                                className="dropdown-item d-flex justify-content-between align-items-center"
                                                                onClick={() => {
                                                                    if (!selectedEmployees.includes(el._id)) {
                                                                        setSelectedEmployees(prev => [...prev, el._id]);
                                                                        setEmployeeName(prev => [...prev, el.name]);
                                                                    } else {
                                                                        setSelectedEmployees(prev => prev.filter(id => id !== el._id));
                                                                        setEmployeeName(prev => prev.filter(name => name !== el.name));
                                                                    }
                                                                }}
                                                            >
                                                                <span>{el.name}</span>
                                                                {selectedEmployees.includes(el._id) ? <>
                                                                    <i className="bi bi-check-circle-fill text-success"></i>
                                                                </>
                                                                    : ""
                                                                    // && (
                                                                    //     <i className="bi bi-check-circle-fill text-success"></i>
                                                                    // )
                                                                }
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li><span className="dropdown-item text-muted">No Employees found</span></li>
                                                )}
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