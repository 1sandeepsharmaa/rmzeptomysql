import { useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function AddTechnology() {
    var [subCatName, setSubCatName] = useState("")
    var [catName, setCatName] = useState("")
    var [categories, setcategories] = useState([])
    var [catId, setCatId] = useState("")
    var [load, setLoad] = useState(false)

    useEffect(() => {
        setLoad(true)
        let data={
            status:"true"
        }
        ApiServices.GetAllCategory(data)
            .then((res) => {
                setcategories(res?.data?.data);
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
        let data = {
            name: subCatName,
            categoryId: catId
        }
        if (!catId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a Department before submitting.",
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }
        ApiServices.AddSubCategory(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: "Technology Added Successfully",
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        setSubCatName("")
                        setCatName("")
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
                <PageTitle child="Add Technology" />
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
                                <h5 className="card-title">Technology Details</h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Technology Name
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={subCatName} onChange={(e) => { setSubCatName(e.target.value) }} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="CategotyName" className="form-label">
                                            Department Name
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