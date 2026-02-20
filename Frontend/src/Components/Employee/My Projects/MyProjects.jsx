import { useEffect, useState } from "react"
import ApiServices from "../../../ApiServices"
import EmployeePageTitle from "../EmployeePageTitle"
import { ScaleLoader } from "react-spinners"
import { Link } from "react-router-dom"

export default function MyProjects() {
    var [load, setLoad] = useState(true)
    var [data, setData] = useState([])
    var id = sessionStorage.getItem("empId")

    useEffect(() => {
        let data = {
            employeeId: id
        }
        ApiServices.GetAllProjectTeam(data)
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
                <EmployeePageTitle child="My Projects" />
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
                                                                <h5 className="card-title">{el?.projectId?.name}</h5>
                                                                <p className="card-text">
                                                                    <strong>Description : </strong>{el?.projectId?.description}
                                                                </p>
                                                                <p lassName="card-text"> <strong>Project Technology :</strong> {el?.projectId?.technology} </p>
                                                                <p lassName="card-text"> <strong>Project Client :</strong> {el?.projectId?.client} </p>
                                                            </div>
                                                            {/* <div className="card-text ms-3 mb-3">
                                                                {el?.status == true ?
                                                                    <button className="btn btn-success">Active</button>
                                                                    : <button className="btn btn-danger">Inactive</button>}
                                                            </div> */}
                                                            <div className="card-footer">
                                                                <Link to={"/employee/viewProjectDetails/" + el?._id} type="button" className="btn" style={{ background: "#6776f4", color: "white" }}>
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