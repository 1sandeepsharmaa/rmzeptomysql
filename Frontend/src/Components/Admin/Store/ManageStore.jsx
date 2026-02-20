import { Link } from "react-router-dom";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageStore() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ================= FETCH =================
  useEffect(() => {
    ApiServices.GetAllStore()
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

  // ================= ACTIVE STORE =================
  const unBlockedStore = data.filter(el => el.status === true);

  // ================= SEARCH FILTER =================
  const filteredData = unBlockedStore.filter(el => {
    const lower = searchTerm.toLowerCase();
    return (
      el?.storeName?.toLowerCase().includes(lower) ||
      el?.storeCode?.toLowerCase().includes(lower) ||
      el?.cityId?.cityName?.toLowerCase().includes(lower)
    );
  });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= CSV =================
  const csvData = filteredData.map((el, idx) => ({
    srNo: idx + 1,
    storeName: el.storeName,
    storeCode: el.storeCode,
    storeCategory: el?.storeCategoryId?.name,
    city: el?.cityId?.cityName,
    state: el?.stateId?.stateName,
    zone: el?.zoneId?.zoneName,
    address: el.address,
    status: "Active",
  }));

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
        ApiServices.ChangeStatusStore({ _id: id, status: "false" })
          .then((res) => {
            setLoad(true);
            Swal.fire({
              title: res?.data?.message,
              icon: res?.data?.success ? "success" : "error",
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

  return (
    <main className="main" id="main">
      <PageTitle child="Manage Store" />

      {/* Loader */}
      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      {/* Search + CSV */}
      {!load && (
        <div className="container-fluid mb-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by Store Name / Code / City"
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
                filename="Active_Stores.csv"
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
                  <th>Store Name</th>
                  <th>Store Code</th>
                  <th>Store Category</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Zone</th>
                  <th>Address</th>
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
                      <td>{el.storeName}</td>
                      <td>{el.storeCode}</td>
                      <td>{el?.storeCategoryId?.name}</td>
                      <td>{el?.cityId?.cityName}</td>
                      <td>{el?.stateId?.stateName}</td>
                      <td>{el?.zoneId?.zoneName}</td>
                      <td>{el.address}</td>
                      <td>
                        <div className="btn-group">
                          <Link
                            to={"/admin/editStore/" + el._id}
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
                    <td colSpan={9} className="text-center text-muted">
                      No Active Store Found
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
  );
}
