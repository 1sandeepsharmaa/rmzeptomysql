import { useEffect, useRef, useState } from "react"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function AddTask() {
    var [title, setTitle] = useState("")
    var [description, setDescription] = useState("")
    var [deadline, setDeadline] = useState("")
    var [attachment, setAttachment] = useState("")
    var [subCatName, setSubCatName] = useState("")
    var [subCategories, setSubCategories] = useState([])
    var [subCatId, setSubCatId] = useState("")

    var [projectName, setProjectName] = useState("")
    var [projects, setProejcts] = useState([])
    var [projectId, setProjectId] = useState("")

    var [employeeName, setEmployeeName] = useState("")
    var [employees, setEmployees] = useState([])
    var [employeeId, setEmployeeId] = useState("")
    var [load, setLoad] = useState(false)
    const fileInputRef = useRef(null);

    useEffect(() => {
        setLoad(true)
        let data={
            status:"true"
        }
        ApiServices.GetAllSubCategory(data)
            .then((res) => {
                setSubCategories(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllProject(data)
            .then((res) => {
                setProejcts(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllEmployee(data)
            .then((res) => {
                setEmployees(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        setTimeout(() => {
            setLoad(false)
        }, 1000)
    }, [])

    function handleForm(e) {
        e.preventDefault()
        setLoad(true)
        let data = new FormData()
        data.append("title", title)
        data.append("description", description)
        data.append("subCategoryId", subCatId)
        data.append("projectId", projectId)
        data.append("employeeId", employeeId)
        data.append("deadline", deadline)
        data.append("attachment", attachment)
        if (!subCatId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a Subactegory before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
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
        if (!employeeId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a Employee before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        ApiServices.AddTask(data)
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
                        setTitle("")
                        setDescription("")
                        setDeadline("")
                        setSubCatName("")
                        setSubCatId("")
                        setProjectName("")
                        setProjectId("")
                        setEmployeeName("")
                        setEmployeeId("")
                        fileInputRef.current.value = '';
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
                <PageTitle child="Add Task" />
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
                                <h5 className="card-title">Task Details</h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Title
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Description
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={description} onChange={(e) => { setDescription(e.target.value) }} required />
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                           Technology
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {subCatName || "Select a Technology"}
                                            </button>
                                            {subCategories?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {subCategories.length > 0 ? (
                                                                subCategories.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setSubCatName(el.name);
                                                                                setSubCatId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No categories found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
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
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setProjectName(el.name);
                                                                                setProjectId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No categories found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
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
                                                                                setEmployeeId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No categories found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Deadline
                                        </label>
                                        <input type="date" name="deadline" className="form-control" id="inputNanme4" value={deadline} onChange={(e) => { setDeadline(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Attachment
                                        </label>
                                        <input type="file" ref={fileInputRef} className="form-control" id="inputEmail4" onChange={(e) => { setAttachment(e.target.files[0]) }} />
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