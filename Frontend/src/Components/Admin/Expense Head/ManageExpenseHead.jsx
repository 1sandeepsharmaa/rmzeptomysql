import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { CSVLink } from "react-csv";

export default function ManageExpenseHead() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ================= FETCH =================
  useEffect(() => {
    ApiServices.GetAllExpenseHead()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setTimeout(() => setLoad(false), 1000);
      });
  }, [load]);

  // ================= STATUS CHANGE =================
  function changeInactiveStatus(id) {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiServices.ChangeStatusExpenseHead({ _id: id, status: "false" })
          .then((res) => {
            setLoad(true);
            Swal.fire({
              title: res?.data?.message,
              icon: res.data.success ? "success" : "error",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => setLoad(false), 1500);
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  }

  // ================= UTILS =================
  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  // ================= DATA =================
  const activeData = data.filter(el => el.status === true);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(activeData.length / itemsPerPage);
  const showPagination = activeData.length > itemsPerPage;

  const currentData = activeData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV =================
  const csvData = activeData.map((el, idx) => ({
    srNo: idx + 1,
    name: el.name,
    description: el.description,
    status: "Active",
  }));

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage Expense Head" />

        {/* Loader */}
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />

        {/* CSV Button */}
        {!load && (
          <div className="container-fluid mb-3 text-end">
            <CSVLink
              data={csvData}
              filename="Active_Expense_Heads.csv"
              className="btn btn-primary btn-sm"
            >
              Download CSV
            </CSVLink>
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
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length ? (
                    currentData.map((el, index) => (
                      <tr key={el._id}>
                        <td>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{el.name}</td>
                        <td>
                          {truncateText(el.description, 50)}
                          {el.description?.length > 50 && (
                            <span
                              style={{
                                color: "blue",
                                cursor: "pointer",
                                marginLeft: 5,
                              }}
                              onClick={() => {
                                setModalTitle(el.name);
                                setModalContent(el.description);
                                setModalOpen(true);
                              }}
                            >
                              View More
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Link
                              to={`/admin/editExpenseHead/${el._id}`}
                              className="btn"
                              style={{ background: "#197ce6ff", color: "white" }}
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No Active Expense Head Found
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
              onClick={() => setCurrentPage(p => p - 1)}
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
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-box position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>

            <h5 className="pe-4">{modalTitle}</h5>
            <p style={{ textAlign: "justify" }}>{modalContent}</p>
          </div>
        </div>
      )}
    </>
  );
}
