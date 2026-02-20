import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";

export default function DailyProgress() {
  var [data, setData] = useState([])
  var [load, setLoad] = useState(true)
  const [progressFilter, setProgressFilter] = useState("");
  var [totalCoin, setTotalCoin] = useState("")
  const [tasks, setTasks] = useState([]);
  var id = sessionStorage.getItem("userId")
  var empId = sessionStorage.getItem("empId")
  useEffect(() => {
    fetchTasks(progressFilter);
  }, [progressFilter])

  const fetchTasks = (filterValue = "") => {
    setLoad(true);
    console.log(filterValue);
    let data = {};
    if (filterValue !== "") {
      data.type = filterValue;
      data.userId = id
    }
    else {
      data.userId = id
    }
    ApiServices.GetAllCoin(data)
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setLoad(false);
      });

    let data1 = {
      _id: empId
    }
    ApiServices.GetAllEmployee(data1)
      .then((res) => {
        setTotalCoin(res?.data?.data[0]?.coins)
        console.log(res?.data?.data[0]?.coins)
      })
      .catch((err) => {
        console.log("Error:", err);
        setLoad(false);
      });
  };

  const handleProgressFilter = (value) => {
    setProgressFilter(value);
    fetchTasks(value);
  };
  useEffect(() => {
    let data = {
      employeeId: empId
    }
    ApiServices.GetAllTask(data)
      .then((res) => {
        setTasks(res && res.data && res.data.data ? res.data.data : []);
        setLoad(false);
      })
      .catch((err) => {
        console.log("Error fetching tasks:", err);
        setLoad(false);
      });

  }, []);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.progress === "Completed").length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <>
      <main className="main" id="main">
        <EmployeePageTitle child="Daily Progress" />

        <div className="container-fluid ">
          <div className="row">
            <div className="col-md-12">
              <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
            </div>
          </div>
        </div>
        <div className={load ? "display-screen" : ""}>
          <div className="container-fluid">
            <div className="row justify-content-between align-items-center mb-3">
              <div className="col-auto">
                <h4 className="fw-bold" style={{ color: "#012970" }}>Reward/Warning List</h4>
              </div>
              <div className="col-auto">
                <h4 className="fw-bold" style={{ color: "#012970" }}>Total Coins: {totalCoin}</h4>
              </div>
              <div className="col-auto">
                <label htmlFor="progressFilter" style={{ color: "#012970" }} className="form-label fw-semibold me-2 mb-0">
                  Filter by Type :
                </label>
                <select
                  id="progressFilter"
                  className="form-select form-select-sm"
                  style={{
                    width: "180px",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "14px"
                  }}
                  value={progressFilter}
                  onChange={(e) => handleProgressFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Reward">Reward</option>
                  <option value="Warning">Warning</option>
                </select>
              </div>
            </div>

            {/* Table starts here */}
            <div className="row">
              <div className="col-lg-12 table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Employee Name</th>
                      <th>Task Name</th>
                      <th>Message</th>
                      <th>Coins</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">No Tasks Found</td>
                      </tr>
                    ) : (
                      data.map((el, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{el?.userId?.name}</td>
                          <td>{el?.taskId?.title}</td>
                          <td>{el?.message}</td>
                          <td>{el?.coinCount}</td>
                          <td>{el?.type}</td>
                          <td>{el?.status ? "true" : "false"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4 col-sm-12">
                <div className="card shadow-lg border-0">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-3">Overall Progress</h5>

                    {load ? (
                      <p className="text-center text-muted">Loading...</p>
                    ) : total === 0 ? (
                      <p className="text-center text-danger">No tasks found</p>
                    ) : (
                      <>
                        {/* Progress Bar */}
                        <div className="progress" style={{ height: "25px" }}>
                          <div
                            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: progressPercent + "%" }}
                            aria-valuenow={progressPercent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {progressPercent}% Completed
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="d-flex justify-content-between mt-3">
                          <span className="text-muted">Total: {total}</span>
                          <span className="text-success">Completed: {completed}</span>
                          <span className="text-danger">Remaining: {total - completed}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}