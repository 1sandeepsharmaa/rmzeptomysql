import { ScaleLoader } from "react-spinners"
import PageTitle from "../../PageTitle"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ApiServices from "../../../ApiServices"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function EditZone() {
    var [zoneName, setZoneName] = useState("")
    var [load, setLoad] = useState(false)
    var nav = useNavigate()
    var params = useParams()
    useEffect(() => {
        setLoad(true)
        let data = {
            _id: params.id
        }
        ApiServices.GetSingleZone(data)
            .then((res) => {
                setZoneName(res.data.data.zoneName)
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
        let data = {
            _id: params.id,
            zoneName: zoneName,
        }
        ApiServices.UpdateZone(data)
            .then((res) => {
                var message = res?.data?.message
                setLoad(true)
                if (res?.data?.success) {
                    Swal.fire({
                        title: "Details Updated Successfully",
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/manageZone")
                    }, 1000)
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
                    }, 1000)
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
                <PageTitle child="Edit Zone" />
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
                                <h5 className="card-title">Zone Details</h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    <div className="col-12">
                                        <label className="form-label">
                                            Zone Name
                                        </label>
                                        <input type="text" className="form-control" id="inputNanme4" value={zoneName} onChange={(e) => { setZoneName(e.target.value) }} />
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