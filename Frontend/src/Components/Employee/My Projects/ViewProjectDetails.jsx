import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApiServices from "../../../ApiServices";

export default function ViewProjectDetails() {
    var [load, setLoad] = useState(false)
    var [data, setData] = useState({})
    var [taskData, setTaskData] = useState([])
    var params = useParams()
    useEffect(() => {
        let data = {
            _id: params.id
        }
        ApiServices.GetSingleProjectTeam(data)
            .then((res) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                setData(res?.data?.data)
                console.log(res?.data?.data);


            })
            .catch((err) => {
                setTimeout(() => {
                    setLoad(false)
                }, 1000)
                console.log("Error is", err);
            })
    }, [params.id])
    useEffect(() => {
        if (data?.projectId?._id) {
            let data1 = {
                projectId: data?.projectId?._id
            }
            ApiServices.GetAllTask(data1)
                .then((res) => {
                    setTaskData(res?.data?.data)
                })
                .catch((err) => {
                    console.log("Error is", err);
                })
        }
    }, [data])
    return (
        <>
            <main id="main" className="main">
                <EmployeePageTitle child="Project Details" />
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
                                    <h2 style={{ color: "#012970" }}><strong>Overview</strong></h2>
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title"><strong> {data?.projectId?.name}</strong></h5>

                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Description :</strong> {data?.projectId?.description}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Client :</strong> {data?.projectId?.client}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Technology :</strong> {data?.projectId?.technology}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Attachment :</strong>{data?.projectId?.attachment ? <Link to={data?.projectId?.attachment} >
                                                <i className="bi bi-file-earmark-fill fs-1" alt="No Document found" />
                                                Click to open
                                            </Link> : "No Document Found"}
                                            </h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Technology :</strong> {data?.projectId?._id}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Status :</strong> {data?.projectId?.status == true ? "true" : "false"}</h5>
                                            <h5 className="card-text" style={{ color: "#012970" }}><strong>Start Date :</strong> {data?.projectId?.createdAt?.split("T")[0]}</h5>


                                        </div>
                                    </div>
                                    <h2 className="mt-2" style={{ color: "#012970" }}><strong>Team Details</strong></h2>
                                    <div className="row row-cols-1 row-cols-md-3 g-4">
                                        {data?.employeeId?.length > 0 ? (
                                            data.employeeId.map((el, index) => (
                                                <div className="col" key={index}>
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{el?.name}</h5>
                                                            <p className="card-text">
                                                                <strong style={{ color: "#012970" }}>Email:</strong> {el?.email}
                                                            </p>
                                                            <p className="card-text">
                                                                <strong style={{ color: "#012970" }}>Contact:</strong> {el?.contact}
                                                            </p>
                                                            <p className="card-text">
                                                                <strong style={{ color: "#012970" }}>Job Title:</strong> {el?.jobTitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-12 text-center text-muted">
                                                <p>No Employees Found</p>
                                            </div>
                                        )}

                                    </div>
                                    <h2 className="mt-4" style={{ color: "#012970" }}><strong>Tasks</strong></h2>

                                    <table className="table table-hover table-striped">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Title</th>
                                                <th>Attachment</th>
                                                <th>Project Name</th>
                                                <th>Employee Name</th>
                                                <th>Sub Category Name</th>
                                                <th>Deadline</th>
                                                <th>Progress</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                taskData?.map((el, index) => {
                                                    return (
                                                        <>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{el?.title}</td>
                                                                <td>{el?.description}</td>
                                                                <td>{el?.projectId?.name}</td>
                                                                <td>{el?.employeeId?.name}</td>
                                                                <td>{el?.subCategoryId?.name}</td>
                                                                <td>{el?.deadline}</td>
                                                                <td>{el?.progress}</td>
                                                                <td>{el?.status == true ? "true" : "false"}</td>

                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>

                                </>
                                : ""}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}