import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function BlockedEmployee() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // ================= FETCH =================
  const fetchAllStaff = async () => {
    try {
      setLoad(true);

      const responses = await Promise.all([
        ApiServices.GetAllFm({ status: "false" }),
        ApiServices.GetAllClm({ status: "false" }),
        ApiServices.GetAllZh({ status: "false" }),
        ApiServices.GetAllZonalCommercial({ status: "false" }),
        ApiServices.GetAllMissingBridge({ status: "false" }),
        ApiServices.GetAllBf({ status: "false" }),
        ApiServices.GetAllProcurement({ status: "false" }),
        ApiServices.GetAllPrPo({ status: "false" }),
      ]);

      const allData = responses.flatMap((res) =>
        res?.data?.success ? res.data.data : []
      );

      setData(allData || []);
    } catch (err) {
      console.log(err);
      setData([]);
    }
    setTimeout(() => setLoad(false), 500);
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    const filtered = data.filter((emp) => {
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;

  // ================= ACTIVATE =================
  function changeActiveStatus(id, designation) {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to activate this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { _id: id, status: true };

        let apiCall;
        if (designation === "FM") apiCall = ApiServices.ChangeStatusFm;
        else if (designation === "CLM") apiCall = ApiServices.ChangeStatusClm;
        else if (designation === "Zonal_Head")
          apiCall = ApiServices.ChangeStatusZh;
        else if (designation === "Zonal_Commercial")
          apiCall = ApiServices.ChangeStatusZonalCommercial;
        else if (designation === "Missing_Bridge")
          apiCall = ApiServices.ChangeStatusMissingBridge;
        else if (designation === "Business_Finance")
          apiCall = ApiServices.ChangeStatusBf;
        else if (designation === "Procurement")
          apiCall = ApiServices.ChangeStatusProcurement;
        else if (designation === "PR/PO")
          apiCall = ApiServices.ChangeStatusPrPo;
        else {
          Swal.fire("Error", "Invalid designation", "error");
          return;
        }

        apiCall(payload)
          .then((res) => {
            Swal.fire({
              title: res?.data?.message,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchAllStaff();
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong", "error");
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
    status: emp.status ? "Active" : "Inactive",
  }));

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Blocked Employee" />

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
              <CSVLink
                data={csvData}
                filename="Blocked_Employees.csv"
                className="btn btn-primary btn-sm"
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
        </div>

        {/* Loader */}
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />

        {/* Table */}
        {!load && (
          <div className="container-fluid">
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
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            changeActiveStatus(el._id, el.designation)
                          }
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No Blocked Employee Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* MODAL */}
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
