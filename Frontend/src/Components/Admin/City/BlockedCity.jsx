import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedCity() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalZone, setModalZone] = useState("");
  const [modalState, setModalState] = useState("");
  const [modalContent, setModalContent] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 20;

  useEffect(() => {
    ApiServices.GetAllCity()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setLoad(false);
      });
  }, []);

  /* ================= BLOCKED CITIES ================= */
  const blockedCities = data.filter((el) => el.status === false);

  /* ================= GROUP BY ZONE + STATE ================= */
  const groupedData = Object.values(
    blockedCities.reduce((acc, city) => {
      const zoneName = city?.zoneId?.zoneName || "";
      const stateName = city?.stateId?.stateName;

      if (!zoneName || !stateName) return acc;

      const key = `${zoneName}_${stateName}`;
      if (!acc[key]) {
        acc[key] = {
          _id: key,
          zoneName,
          stateName,
          cities: [],
        };
      }

      acc[key].cities.push(city.cityName);
      return acc;
    }, {})
  );

  /* ================= SEARCH ================= */
  const filteredData = groupedData.filter(
    (el) =>
      el.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.cities.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((el, idx) => ({
    SrNo: idx + 1,
    Zone: el.zoneName,
    State: el.stateName,
    Cities: el.cities.join(", "),
  }));

  /* ================= UNBLOCK CITY ================= */
  function changeActiveStatus(id) {
    Swal.fire({
      title: "Unblock City?",
      text: "Do you want to unblock this city?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unblock",
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { _id: id, status: true };

        ApiServices.ChangeStatusCity(payload)
          .then((res) => {
            if (res?.data?.success) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 1200,
              });

              setTimeout(() => {
                navigate("/admin/blockedCity");
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
        <PageTitle child="Blocked City" />

        {/* Loader */}
        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
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
                  placeholder="Search by Zone, State or City"
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
                  filename="Blocked_Cities.csv"
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
                      <th>State</th>
                      <th>Cities</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentData.length ? (
                      currentData.map((el, index) => (
                        <tr key={el._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{el.zoneName}</td>
                          <td>{el.stateName}</td>
                          <td>
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => {
                                setModalZone(el.zoneName);
                                setModalState(el.stateName);
                                setModalContent(el.cities);
                                setModalOpen(true);
                              }}
                            >
                              View Cities
                            </span>
                          </td>
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
                          No Blocked City Found
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
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>

            <h5 className="mb-1">
              Zone: <span className="fw-normal">{modalZone}</span>
            </h5>
            <h6 className="mb-3">
              State: <span className="fw-normal">{modalState}</span>
            </h6>

            <hr />

            <h6 className="mb-2">Cities</h6>

            {modalContent.length > 0 ? (
              <ul className="ps-3">
                {modalContent.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">No Cities Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
