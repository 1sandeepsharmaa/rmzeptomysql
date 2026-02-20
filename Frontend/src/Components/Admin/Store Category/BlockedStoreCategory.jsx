import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedStoreCategory() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 20;
  const navigate = useNavigate();

  // ================= FETCH DATA =================
  useEffect(() => {
    ApiServices.GetAllStoreCategory()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
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
  }, []);

  // ================= BLOCKED CATEGORIES =================
  const blockedCategories = data.filter((el) => el.status === false);

  // ================= SEARCH FILTER =================
  const filteredData = blockedCategories.filter((el) =>
    el?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV DATA =================
  const csvData = filteredData.map((el, idx) => ({
    srNo: idx + 1,
    name: el.name,
    description: el.description,
    status: "Blocked",
  }));

  // ================= CHANGE STATUS =================
  function changeActiveStatus(id) {
    Swal.fire({
      title: "Unblock Category?",
      text: "Do you want to unblock this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unblock",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.ChangeStatusStoreCategory({ _id: id, status: true })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1200,
              });

              setTimeout(() => {
                navigate("/admin/manageStoreCategory");
              }, 1200);
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  }

  return (
    <main className="main" id="main">
      <PageTitle child="Blocked Store Category" />

      {/* Loader */}
      {load && (
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />
      )}

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Name"
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
                filename="Blocked_Store_Categories.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!load && (
        <div className="container-fluid">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length ? (
                  currentData.map((el, index) => (
                    <tr key={el._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{el.name}</td>
                      <td>{el.description}</td>
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
                    <td colSpan={5} className="text-center text-muted">
                      No Blocked Store Category Found
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
              className={`btn me-1 ${
                currentPage === i + 1 ? "btn-primary" : "btn-light"
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
