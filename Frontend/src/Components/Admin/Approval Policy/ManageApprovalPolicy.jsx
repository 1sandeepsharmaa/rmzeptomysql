import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";

export default function ManageApprovalPolicy() {
  const [policies, setPolicies] = useState([]);
  const [load, setLoad] = useState(true);
  const isViewer = sessionStorage.getItem("userType") === "11";
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ================= FETCH =================
  const fetchPolicies = () => {
    setLoad(true);
    ApiServices.GetAllApprovalPolicy()
      .then((res) => {
        if (res?.data?.success) {
          setPolicies(res.data.data || []);
        } else {
          setPolicies([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setPolicies([]);
        setTimeout(() => setLoad(false), 1000);
      });
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ================= STATUS CHANGE =================
  function changeInactiveStatus(id) {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to block this policy?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.ChangeStatusApprovalPolicy({
          _id: id,
          status: false,
        })
          .then((res) => {
            Swal.fire({
              title: res?.data?.message,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchPolicies(); // ✅ REFRESH LIST
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  }

  // ================= FILTER =================
  const activePolicies = policies
    .filter((el) => el.status === true)
    .filter((el) => {
      const lower = searchTerm.toLowerCase();
      return (
        el.minAmount?.toString().includes(lower) ||
        el.maxAmount?.toString().includes(lower) ||
        el.approvalLevels?.join(" ").toLowerCase().includes(lower)
      );
    });

  const totalPages = Math.ceil(activePolicies.length / itemsPerPage);
  const showPagination = activePolicies.length > itemsPerPage;

  const currentPolicies = activePolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV =================
  const csvData = activePolicies.map((el, idx) => ({
    srNo: idx + 1,
    minAmount: el.minAmount,
    maxAmount: el.maxAmount,
    approvalLevels: el.approvalLevels?.join(" → "),
    status: "Active",
  }));

  return (
    <main className="main" id="main">
      <PageTitle child="Manage Approval Policy" />

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Amount or Approval Level"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="col-md-6 text-end">
              <CSVLink
                data={csvData}
                filename="Active_Approval_Policy.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {/* Table */}
      {!load && (
        <div className="container-fluid">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No</th>
                  <th>Min Amount</th>
                  <th>Max Amount</th>
                  <th>Approval Levels</th>
                  <th>Status</th>
                  {!isViewer && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {currentPolicies.length ? (
                  currentPolicies.map((el, index) => (
                    <tr key={el._id}>
                      <td>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>{el.minAmount}</td>
                      <td>{el.maxAmount}</td>
                      <td>{el.approvalLevels?.join(" → ")}</td>
                      <td>Active</td>
                      {!isViewer && (
                        <td>
                          <div className="btn-group">
                            <Link
                              to={"/admin/editApprovalPolicy/" + el._id}
                              className="btn"
                              style={{ background: "#197ce6", color: "white" }}
                            >
                              <i className="bi bi-pen"></i>
                            </Link>

                            <button
                              className="btn ms-2"
                              style={{ background: "#6c757d", color: "white" }}
                              onClick={() => changeInactiveStatus(el._id)}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No Active Approval Policy Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn me-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
