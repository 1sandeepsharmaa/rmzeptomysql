import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedExpenseHead() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const navigate = useNavigate();

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
        setLoad(false);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setData([]);
        setLoad(false);
      });
  }, []);

  // ================= DATA =================
  const blockedExpenseHeads = data.filter(el => el.status === false);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(blockedExpenseHeads.length / itemsPerPage);
  const showPagination = blockedExpenseHeads.length > itemsPerPage;

  const currentData = blockedExpenseHeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV =================
  const csvData = blockedExpenseHeads.map((el, idx) => ({
    srNo: idx + 1,
    name: el.name,
    description: el.description,
    status: "Blocked",
  }));

  // ================= UTILS =================
  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  // ================= UNBLOCK =================
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
        ApiServices.ChangeStatusExpenseHead({ _id: id, status: true })
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1200,
              });

              setTimeout(() => {
                navigate("/admin/manageExpenseHead");
              }, 1200);
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  }

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Blocked Expense Head" />

        {/* Loader */}
        {load && (
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            loading={load}
          />
        )}

        {/* CSV */}
        {!load && (
          <div className="container-fluid mb-3 text-end">
            <CSVLink
              data={csvData}
              filename="Blocked_Expense_Heads.csv"
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
                                setModalContent(el.description);
                                setModalOpen(true);
                              }}
                            >
                              View More
                            </span>
                          )}
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
                      <td colSpan={4} className="text-center text-muted">
                        No Blocked Expense Head Found
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
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Description</h5>
            <p>{modalContent}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
