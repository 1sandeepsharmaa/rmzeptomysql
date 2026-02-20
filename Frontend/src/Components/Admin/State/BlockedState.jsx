import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedState() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    ApiServices.GetAllState()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setData([]);
        setTimeout(() => setLoad(false), 500);
      });
  }, [load]);

  const blockedStates = data.filter((el) => el.status === false);

  // ================= UNBLOCK =================
  function changeActiveStatus(id) {
    Swal.fire({
      title: "Unblock State?",
      text: "Do you want to unblock this state?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unblock",
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { _id: id, status: true };
        ApiServices.ChangeStatusState(payload)
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1200,
              });
              setLoad(true);
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong!", "error");
          });
      }
    });
  }

  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  // ================= SEARCH =================
  const filteredStates = blockedStates.filter(
    (el) =>
      el.zoneId?.zoneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.stateName.join(", ").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);
  const currentData = filteredStates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ================= CSV DATA =================
  const csvData = filteredStates.map((el, idx) => ({
    SrNo: idx + 1,
    Zone: el.zoneId?.zoneName || "",
    States: el.stateName.join(", "),
    Status: "Blocked",
  }));

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Blocked State" />

        {/* Loader */}
        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            size={200}
            loading={load}
          />
        </div>

        {/* Search + CSV */}
        {!load && (
          <div className="container-fluid mb-3">
            <div className="row align-items-center">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Search by Zone or State"
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
                  filename="Blocked_States.csv"
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
            <div className="row justify-content-center">
              <div className="col-lg-12 mt-3 table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Zone</th>
                      <th>States</th>
                      <th>Status</th>
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
                          <td>{el.zoneId?.zoneName}</td>
                          <td>
                            {truncateText(el.stateName.join(", "), 50)}
                            {el.stateName.join(", ").length > 50 && (
                              <span
                                style={{
                                  color: "blue",
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                }}
                                onClick={() => {
                                  setModalTitle(
                                    el.zoneId?.zoneName || "States",
                                  );
                                  setModalContent(el.stateName.join(", "));
                                  setModalOpen(true);
                                }}
                              >
                                View More
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-danger">Blocked</span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn ms-2"
                                style={{
                                  background: "#198754",
                                  color: "white",
                                }}
                                onClick={() => changeActiveStatus(el._id)}
                              >
                                <i className="bi bi-check-circle"></i> Unblock
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No Blocked State Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
              type="button"
              className="btn-close btn-close-red btn-close-large position-absolute top-0 end-0 m-2"
              aria-label="Close"
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
