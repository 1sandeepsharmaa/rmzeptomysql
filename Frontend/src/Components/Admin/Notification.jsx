import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Notification() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncements([
        {
          _id: "1",
          name: "Admin",
          createdAt: "2026-01-10T10:30:00",
          title: "Office Holiday",
          message:
            "Office will remain closed on Friday due to maintenance work.",
        },
        {
          _id: "2",
          name: "HR Team",
          createdAt: "2026-01-08T15:00:00",
          title: "Policy Update",
          message:
            "Please review the updated leave policy available on the employee portal.",
        },
        {
          _id: "3",
          name: "Management",
          createdAt: "2026-01-05T09:00:00",
          title: "New Project Kickoff",
          message:
            "We are excited to announce the kickoff of our new internal project starting next week.",
        },
      ]);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main id="main" className="main">
      <EmployeePageTitle child="Announcements" />

      {/* Loader */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <ScaleLoader color="#6776f4" />
        </div>
      ) : (
        <div className="container-fluid mt-3">
          {announcements.length > 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-12">
                {announcements.map((el) => (
                  <div key={el._id} className="d-flex mb-4">
                    <div style={styles.adminBubble}>
                      <div className="d-flex align-items-center mb-1 flex-wrap">
                        <p className="mb-0 fw-bold" style={styles.sender}>
                          {el.name}
                        </p>
                        <small className="ms-2" style={styles.time}>
                          {moment(el.createdAt).fromNow()}
                        </small>
                      </div>

                      <p className="mb-1 fw-semibold" style={styles.title}>
                        {el.title}
                      </p>
                      <p className="mb-0" style={styles.message}>
                        {el.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center mt-5 text-muted">
              <p>No announcements available.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

const styles = {
  adminBubble: {
    backgroundColor: "#eaf3ff",
    padding: "14px 20px",
    borderRadius: "16px",
    maxWidth: "75%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  sender: {
    fontSize: "15px",
    color: "#2c3e50",
  },
  time: {
    fontSize: "12px",
    color: "#7f8c8d",
  },
  title: {
    fontSize: "16px",
    color: "#34495e",
  },
  message: {
    fontSize: "14px",
    color: "#444",
    whiteSpace: "pre-line",
  },
};
