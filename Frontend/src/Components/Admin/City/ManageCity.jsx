import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageCity() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalZone, setModalZone] = useState("");
  const [modalState, setModalState] = useState("");
  const [modalCities, setModalCities] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // Search
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 20;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    ApiServices.GetAllCity()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= ACTIVE CITIES ================= */
  const activeCities = data.filter((el) => el.status === true);

  /* ================= GROUP BY ZONE + STATE ================= */
  const groupedData = Object.values(
    activeCities.reduce((acc, city) => {
      const zoneId = city?.zoneId?._id;
      const zoneName = city?.zoneId?.zoneName;
      const stateName = city?.stateId?.stateName;

      if (!zoneId || !stateName) return acc;

      const key = `${zoneId}_${stateName}`;

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
    }, {}),
  );

  /* ================= SEARCH ================= */
  const filteredData = groupedData.filter(
    (el) =>
      el.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.cities.join(" ").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ================= CSV DATA ================= */
  const csvData = filteredData.map((el, idx) => ({
    SrNo: idx + 1,
    Zone: el.zoneName,
    State: el.stateName,
    Cities: el.cities.join(", "),
  }));

  /* ================= CHANGE STATUS ================= */
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
        let payload = { _id: id, status: "false" };
        ApiServices.ChangeStatusCity(payload)
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
            setLoad(true);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
              timerProgressBar: true,
            });
            setTimeout(() => setLoad(false), 2000);
          });
      }
    });
  }

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage City" />

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
                  filename="Active_Cities.csv"
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
                          <td>{el.zoneName}</td>
                          <td>{el.stateName}</td>
                          <td>
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => {
                                setModalZone(el?.zoneId?.zoneName);
                                setModalState(el?.stateId?.stateName);
                                setModalCities(el?.cityName || []);
                                setModalOpen(true);
                              }}
                            >
                              View Cities ({el?.cityName?.length || 0})
                            </span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/admin/editCity/${el._id}`}
                                className="btn"
                                style={{
                                  background: "#197ce6ff",
                                  color: "white",
                                }}
                              >
                                <i className="bi bi-pen"></i>
                              </Link>

                              <button
                                className="btn ms-2"
                                style={{
                                  background: "#6c757d",
                                  color: "white",
                                }}
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
                        <td colSpan={5} className="text-center text-muted">
                          No Active City Found
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
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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

            <h6>Zone : {modalZone}</h6>
            <h6>State : {modalState}</h6>
            <hr />

            {modalCities.length > 0 ? (
              <ul>
                {modalCities.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No Cities Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
