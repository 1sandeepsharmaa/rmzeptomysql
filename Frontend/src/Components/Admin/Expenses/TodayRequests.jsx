import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function TodayRequests() {
  const [expenses, setExpenses] = useState([]);
  const [load, setLoad] = useState(false);

  const [amounts, setAmounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    hold: 0,
  });

  useEffect(() => {
    fetchTodayExpenses();
  }, []);

  const fetchTodayExpenses = async () => {
    setLoad(true);
    try {
      const res = await ApiServices.GetAllExpense();
      const allExpenses = res?.data?.data || [];

      const todayDate = new Date().toISOString().split("T")[0];

      const todayExpenses = allExpenses.filter(
        (e) => e.createdAt?.split("T")[0] === todayDate
      );

      const pending = todayExpenses.filter(e => e.currentStatus === "Pending");
      const approved = todayExpenses.filter(e => e.currentStatus === "Approved");
      const rejected = todayExpenses.filter(e => e.currentStatus === "Rejected");
      const hold = todayExpenses.filter(e => e.currentStatus === "Hold");

      const sum = (arr) =>
        arr.reduce((t, e) => t + Number(e.amount || 0), 0);

      setExpenses(todayExpenses);

      setAmounts({
        total: sum(todayExpenses),
        pending: sum(pending),
        approved: sum(approved),
        rejected: sum(rejected),
        hold: sum(hold),
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Today's New Requests" />

      {load && (
        <div className="text-center mt-4">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <div className="container-fluid mt-3">

          {/* 💰 TODAY AMOUNT SUMMARY */}
          <div className="row mb-3">
            <div className="col-md-12">
              <h6 className="fw-bold">
                Total Today Amount :
                <span className="ms-2 text-info">
                  ₹ {amounts.total.toLocaleString()}
                </span>
              </h6>

              <h6 className="fw-bold">
                Pending :
                <span className="ms-2 text-warning">
                  ₹ {amounts.pending.toLocaleString()}
                </span>
                {"  |  "}
                Approved :
                <span className="ms-2 text-success">
                  ₹ {amounts.approved.toLocaleString()}
                </span>
                {"  |  "}
                Rejected :
                <span className="ms-2 text-danger">
                  ₹ {amounts.rejected.toLocaleString()}
                </span>
                {"  |  "}
                Hold :
                <span className="ms-2 text-primary">
                  ₹ {amounts.hold.toLocaleString()}
                </span>
              </h6>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Ticket ID</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Attachment</th>
                </tr>
              </thead>

              <tbody>
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Requests Created Today
                    </td>
                  </tr>
                )}

                {expenses.map((e, index) => (
                  <tr key={e._id}>
                    <td>{index + 1}</td>
                    <td>{e.ticketId || "-"}</td>
                    <td>{new Date(e.createdAt).toLocaleString()}</td>
                    <td>₹ {Number(e.amount || 0).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          e.currentStatus === "Pending"
                            ? "bg-warning text-dark"
                            : e.currentStatus === "Approved"
                            ? "bg-success"
                            : e.currentStatus === "Hold"
                            ? "bg-primary"
                            : "bg-danger"
                        }`}
                      >
                        {e.currentStatus}
                      </span>
                    </td>
                    <td>
                      {e.attachment ? (
                        <a
                          href={e.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
