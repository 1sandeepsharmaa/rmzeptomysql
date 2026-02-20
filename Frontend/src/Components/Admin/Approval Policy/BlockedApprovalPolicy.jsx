import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedAppovalPolicy() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ================= FETCH =================
  const fetchPolicies = () => {
    setLoad(true);
    ApiServices.GetAllApprovalPolicy()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setData([]);
        setLoad(false);
      });
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    const blocked = data
      .filter((el) => el.status === false)
      .filter((el) => {
        const lower = searchTerm.toLowerCase();
        return (
          el.minAmount?.toString().includes(lower) ||
          el.maxAmount?.toString().includes(lower) ||
          el.approvalLevels?.join(" ").toLowerCase().includes(lower)
        );
      });

    setFilteredData(blocked);
    setCurrentPage(1);
  }, [data, searchTerm]);

  const currentPolicies = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;

  // ================= UNBLOCK =================
  function changeActiveStatus(id) {
    Swal.fire({
      title: "Unblock Approval Policy?",
      text: "Do you want to unblock this approval policy?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unblock",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.ChangeStatusApprovalPolicy({
          _id: id,
          status: true,
        })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1200,
              });
              fetchPolicies(); // ✅ refresh list
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  }

  // ================= CSV =================
  const csvData = filteredData.map((el, idx) => ({
    srNo: idx + 1,
    minAmount: el.minAmount,
    maxAmount: el.maxAmount,
    approvalLevels: el.approvalLevels?.join(" → "),
    status: "Blocked",
  }));

  return (
    <main className="main" id="main">
      <PageTitle child="Blocked Approval Policy" />

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Amount or Approval Level"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-6 text-end">
              <CSVLink
                data={csvData}
                filename="Blocked_Approval_Policy.csv"
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
                  <th>Action</th>
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
                      <td>
                        <span className="badge bg-danger">Blocked</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => changeActiveStatus(el._id)}
                        >
                          <i className="bi bi-check-circle"></i> Unblock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      No Blocked Approval Policy Found
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
