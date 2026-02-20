import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useRef, useState } from "react"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function EditProject() {
    var [name, setName] = useState("")
    var [description, setDescription] = useState("")
    var [attachment, setAttachment] = useState("")
    var [client, setClient] = useState("")
    var [technology, setTechnology] = useState("")
    var [load, setLoad] = useState(false)
    var nav = useNavigate()
    const fileInputRef = useRef(null);
    var params = useParams()
    useEffect(() => {
        let data = {
            _id: params.id
        }
        ApiServices.GetSingleProject(data)
            .then((res) => {
                setLoad(true)
                setName(res.data.data.name)
                setDescription(res.data.data.description)
                setAttachment(res.data.data.attachment)
                setClient(res.data.data.client)
                setTechnology(res.data.data.technology)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
            .catch((err) => {
                console.log("err is", err);

            })
    }, [])
    function handleForm(e) {
        e.preventDefault()
        setLoad(true)
        let data = new FormData()
        data.append("_id", params.id)
        data.append("name", name)
        data.append("description", description)
        data.append("attachment", attachment)
        data.append("client", client)
        data.append("technology", technology)
        ApiServices.UpdateProject(data)
            .then((res) => {
                var message = res?.data?.message
                setLoad(true)
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
                        nav("/admin/manageProject")
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
                <PageTitle child="Edit Project" />
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
                                        <label className="form-label">
                                            Technology
                                        </label>
                                        <input type="text" className="form-control" id="inputEmail4" value={technology} onChange={(e) => { setTechnology(e.target.value) }} required />
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