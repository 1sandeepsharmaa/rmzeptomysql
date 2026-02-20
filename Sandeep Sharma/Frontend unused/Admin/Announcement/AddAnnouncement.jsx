import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddAnnouncement() {

    var [title, setTitle] = useState("")
    var [message, setMessage] = useState("")
    var [attachment, setAttachment] = useState("")
    var [load, setLoad] = useState("")
    const nav = useNavigate();
    const id = sessionStorage.getItem("userId")
    function handleForm(e) {
        e.preventDefault()
        setLoad(true)
        let data = new FormData()
        data.append("title", title)
        data.append("message", message)
        data.append("createdBy", id)
        data.append("attachment", attachment)
        ApiServices.AddAnnouncement(data)
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
                        nav("/admin/announcement")
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
                <PageTitle child="Add Announcement" />

                {/* Loader */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader
                                color="#6776f4"
                                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                                size={200}
                                loading={load}
                            />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className={load ? "display-screen" : ""}>
                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">

                                {/* Back Arrow + Title */}
                                <div className="d-flex align-items-center mb-3">
                                    <button
                                        className="btn btn-link p-0 me-2"
                                        onClick={() => nav(-1)}
                                        style={{ textDecoration: "none", fontSize: "1.2rem" }}
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                    </button>
                                    <h5 className="card-title mb-0">Announcement Details</h5>
                                </div>

                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Attachment</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setAttachment(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{ background: "#6776f4", color: "white" }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
