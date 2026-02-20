import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import EmployeePageTitle from "../EmployeePageTitle";
export default function ManageTasks() {
    var [data, setData] = useState([])
    var [load, setLoad] = useState(true)
    const id = sessionStorage.getItem("empId")
    useEffect(() => {
        let data = {
            employeeId: id
        }
        ApiServices.GetAllTask(data)
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data)
                }
                else {
                    setData([])
                }
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            })
            .catch((err) => {
                toast.error("Something Went Wrong")
                console.log("Error is ", err);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
    }, [load])
    return (
        <>
            <main className="main" id="main">
                <EmployeePageTitle child="Manage Tasks" />

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
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Project Name</th>
                                            <th>Employee Name</th>
                                            <th>Technology</th>
                                            <th>Deadline</th>
                                            <th>Progress</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((el, index) => {
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
                                                        <td>
                                                            <div className="btn-group">
                                                                {el?.progress == "Completed" ?
                                                                    <>
                                                                        <Link to={"/employee/editSubmitTask/" + el?._id} className="btn" style={{background:"#2979ff",color:"white"}}>
                                                                            Edit
                                                                        </Link>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Link to={"/employee/viewTaskDetails/" + el?._id} className="btn btn-success">
                                                                            Submit
                                                                        </Link>

                                                                    </>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                : ""}
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}