import { useEffect, useState, useRef } from "react";
import ApiServices from "../../../ApiServices";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function TrackExpenses() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Ref for table container
  const tableRef = useRef(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({ userId })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
          setFilteredData(res.data.data || []);
        } else {
          setData([]);
          setFilteredData([]);
        }
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setFilteredData([]);
        setLoad(false);
      });
  }, []);

  // Search by Ticket ID
  useEffect(() => {
    const result = search.trim()
      ? data.filter((el) =>
          el.ticketId?.toLowerCase().includes(search.toLowerCase())
        )
      : data;

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, data]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;
  const currentExpenses = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Scroll to top of table when page changes
  useEffect(() => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  return (
    <main className="main" id="main">
      <PageTitle child="Track Expenses" />

      {/* Search Bar */}
      <div className="container-fluid mt-4">
        <div className="row mb-3">
          <div className="col-lg-4 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: "12px" }} ref={tableRef}>
        {load && (
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          />
        )}

        {!load && (
          <div className="container-fluid">
            <div className="expense-cards-container">
              {currentExpenses.length === 0 && (
                <div className="text-center text-muted">No Expenses Found</div>
              )}

              {currentExpenses.map((el) => (
                <div key={el._id} className="expense-card-wrapper">
                  <div className="card expense-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className=" mt-3 ms-3">
                          <h6 className="ticket-id mb-2">
                            Ticket ID: {el.ticketId}
                          </h6>
                          <p className="text-muted mb-1">
                            <strong>Store:</strong> {el.storeId?.storeName}
                          </p>
                          <p className="text-muted mb-1">
                            <strong>Expense:</strong> {el.expenseHeadId?.name}
                          </p>
                          <p className="text-muted mb-0">
                            <strong>Date:</strong> {el.createdAt?.split("T")[0]}
                          </p>
                        </div>
                        <div className="justify-content-between align-items-center me-3">
                          <h5 className="amount-text mb-2">₹ {el.amount}</h5>
                          <Link
                            to={`/fm/expenseTrackingCard/${el._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Track
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="d-flex justify-content-center mt-4">
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
      </div>
    </main>
  );
}
