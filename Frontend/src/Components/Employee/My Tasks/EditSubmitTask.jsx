import { ScaleLoader } from "react-spinners"
import { useEffect, useState } from "react"
import ApiServices from "../../../ApiServices"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import EmployeePageTitle from "../EmployeePageTitle"
export default function EditSubmitTask() {
    var [attachment, setAttachment] = useState("")
    var [load, setLoad] = useState(false)
    var nav = useNavigate()
    var params = useParams()
    useEffect(() => {
        let data = {
            _id: params.id
        }
        ApiServices.GetSingleSubmit(data)
            .then((res) => {
                setLoad(true)
                setAttachment(res?.data?.data?.attachment)
                setTimeout(() => {
                    setLoad(false)
                }, 2000)

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
        data.append("attachment", attachment)
        ApiServices.UpdateTask(data)
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
                        nav("/employee/manageTasks")
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
                <EmployeePageTitle child="Edit Task" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>


                    <div className="col-lg-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Edit Task </h5>
                                {/* Vertical Form */}
                                <form className="row g-3" onSubmit={handleForm}>
                                    
                                    <div className="col-12">
                                        <label className="form-label">
                                            Attachment
                                        </label>
                                        <input type="file"  className="form-control" id="inputEmail4" onChange={(e) => { setAttachment(e.target.files[0]) }} />
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



