import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageBusinessFinance() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // 🔹 Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // ================= FETCH (BUSINESS FINANCE ONLY) =================
  const fetchBusinessFinance = async () => {
    try {
      setLoad(true);
      const res = await ApiServices.GetAllBf();

      if (res?.data?.success) {
        // 🔥 HARD FILTER: ONLY BUSINESS FINANCE
        const bfOnly = (res.data.data || []).filter(
          (u) => u.designation === "Business_Finance"
        );
        setData(bfOnly);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log("Error is", err);
      setData([]);
    }
    setTimeout(() => setLoad(false), 500);
  };

  useEffect(() => {
    fetchBusinessFinance();
  }, []);

  // ================= FILTER (SEARCH + ACTIVE) =================
  useEffect(() => {
    const filtered = data
      .filter((emp) => emp.status === true)
      .filter((emp) => {
        const lower = searchTerm.toLowerCase();
        return (
          emp?.name?.toLowerCase().includes(lower) ||
          emp?.empcode?.toLowerCase().includes(lower)
        );
      });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const currentEmployees = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        const payload = {
          _id: id,
          status: "false",
        };

        ApiServices.ChangeStatusBf(payload)
          .then((res) => {
            Swal.fire({
              title: res?.data?.message,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchBusinessFinance();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            console.log("Error is", err);
          });
      }
    });
  }

  // ================= CSV =================
  const csvData = filteredData.map((emp, idx) => ({
    srNo: idx + 1,
    empcode: emp.empcode,
    name: emp.name,
    email: emp.email,
    contact: emp.contact,
    stores: emp?.storeId?.map((s) => s.storeName).join(", "),
    designation: emp.designation,
  }));

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage Business Finance" />

        {/* Search + CSV */}
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end">
              <CSVLink data={csvData} className="btn btn-primary btn-sm">
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            loading={load}
          />

          {!load && (
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Store</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.length ? (
                  currentEmployees.map((el, idx) => (
                    <tr key={el._id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{el.empcode}</td>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.contact}</td>

                      <td>
                        <span
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() => {
                            setModalTitle(`${el.name} - Stores`);
                            setModalContent(el.storeId || []);
                            setModalOpen(true);
                          }}
                        >
                          View Stores
                        </span>
                      </td>

                      <td>{el.designation}</td>
                      <td>{el.status ? "Active" : "Inactive"}</td>
                      <td>
                        <div className="btn-group">
                          <Link
                            to={`/admin/editEmployee/${el._id}`}
                            state={{ designation: el.designation }}
                            className="btn btn-primary me-2"
                          >
                            <i className="bi bi-pen"></i>
                          </Link>
                          <button
                            className="btn btn-secondary"
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
                    <td colSpan={9} className="text-center text-muted">
                      No Active Business Finance Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>

            <h5>{modalTitle}</h5>
            <ul>
              {modalContent.map((s, i) => (
                <li key={i}>{s.storeName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
