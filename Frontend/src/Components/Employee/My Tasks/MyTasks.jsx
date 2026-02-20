import { useEffect, useState } from "react"
import ApiServices from "../../../ApiServices"
import EmployeePageTitle from "../EmployeePageTitle"
import { ScaleLoader } from "react-spinners"
import { Link } from "react-router-dom"

export default function MyTasks() {
    var [load, setLoad] = useState(true)
    var [data, setData] = useState([])
    var id = sessionStorage.getItem("empId")

    useEffect(() => {
        let data = {
            employeeId: id
        }
        ApiServices.GetAllTask(data)
            .then((res) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                setData(res?.data?.data)
            })
            .catch((err) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                console.log("Error is", err);
            })
    }, [])
    return (
        <>
            <main id="main" className="main">
                <EmployeePageTitle child="My Tasks" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mt-5 table-responsive">
                            {!load ?
                                <>
                                    <div className="row row-cols-1 row-cols-md-3 g-4">
                                        {data?.map((el, index) => {
                                            return (
                                                < >
                                                    <div key={index} className="col">
                                                        <div className="card h-100">
                                                            <div className="card-body">
                                                                <h5 className="card-title">{el?.title}</h5>
                                                                <p className="card-text">
                                                                    <strong>Description : </strong>{el?.description}
                                                                </p>
                                                                <p className="card-text"> <strong>DeadLine :</strong> {el?.deadline} </p>
                                                                {/* <p className="card-text"> <strong>Progress :</strong> {el?.progress} </p> */}
                                                            </div>
                                                            <div className="card-text ms-3 mb-3">
                                                                {el?.progress == "Completed" ?
                                                                    <i className="badge text-bg-success">Completed</i>
                                                                    :
                                                                    (
                                                                        <>
                                                                            {el?.progress == "InProgress" ?
                                                                                <i className="badge text-bg-primary" >In Progress</i>
                                                                                :
                                                                                <i className="badge text-bg-danger" >Pending</i>
                                                                            }
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="card-footer">
                                                                <Link to={"/employee/viewTaskDetails/" + el?._id} type="button" className="btn" style={{ background: "#6776f4", color: "white" }}>
                                                                    View Details
                                                                </Link>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                </>
                                : ""}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}