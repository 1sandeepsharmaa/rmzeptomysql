import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useRef, useState } from "react"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function AddProject() {
    var [name, setName] = useState("")
    var [description, setDescription] = useState("")
    var [attachment, setAttachment] = useState("")
    var [client, setClient] = useState("")

    var [catName, setCatName] = useState("")
    var [categories, setcategories] = useState([])
    var [catId, setCatId] = useState("")

    var [subCatName, setSubCatName] = useState("")
    var [subCategories, setSubCategories] = useState([])
    var [subCatId, setSubCatId] = useState("")

    var [load, setLoad] = useState(false)
    var nav = useNavigate()
    const fileInputRef = useRef(null);
    useEffect(() => {
        setLoad(true)
        let data = {
            status: "true"
        }
        ApiServices.GetAllCategory(data)
            .then((res) => {
                setcategories(res?.data?.data);
            })
            .catch((err) => {
                console.log("Error is ", err);
            })
        ApiServices.GetAllSubCategory(data)
            .then((res) => {
                setSubCategories(res?.data?.data);
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
        if (!attachment) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a file before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        setLoad(true)
        let data = new FormData()
        data.append("name", name)
        data.append("description", description)
        data.append("attachment", attachment)
        data.append("client", client)
        data.append("categoryId", catId)
        data.append("subCategoryId", subCatId)
        ApiServices.AddProject(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 3000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/addProject")
                        setName("")
                        setDescription("")
                        setClient("")
                        setCatName("")
                        setSubCatName("")
                        fileInputRef.current.value = '';
                    }, 3000)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 3000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/addProject")
                    }, 3000)
                }

            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 3000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 3000)
                console.log("Error is", err)
            })


    }
    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Add Project" />
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
                                <h5 className="card-title">Project Details </h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Name
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={name} onChange={(e) => { setName(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Description
                                        </label>
                                        <input type="text" className="form-control" id="inputEmail4" value={description} onChange={(e) => { setDescription(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Attachment
                                        </label>
                                        <input type="file" ref={fileInputRef} className="form-control" id="inputEmail4" onChange={(e) => { setAttachment(e.target.files[0]) }} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Client
                                        </label>
                                        <input type="text" className="form-control" id="inputEmail4" value={client} onChange={(e) => { setClient(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Department
                                        </label>
                                        <div className="dropdown text-center ">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                id="categoryDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {catName || "Select a Department"}
                                            </button>
                                            {categories?.map((el, index) => {
                                                return (
                                                    <>
                                                        <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                                            {categories.length > 0 ? (
                                                                categories.map((el) => (
                                                                    <li key={el._id}>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item"
                                                                            onClick={() => {
                                                                                setCatName(el.name);
                                                                                setCatId(el._id);
                                                                            }}

                                                                        >
                                                                            {el.name}
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li><span className="dropdown-item text-muted">No Department found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
                                        </div>
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
                                                                <li><span className="dropdown-item text-muted">No Technology found</span></li>
                                                            )}
                                                        </ul>

                                                    </>
                                                )
                                            })}
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