import { ScaleLoader } from "react-spinners";
import EmployeePageTitle from "../EmployeePageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import moment from "moment";

export default function ViewAnnouncement() {
    var [load, setLoad] = useState("")
    var [data, setData] = useState([])

    useEffect(() => {
        ApiServices.GetAllAnnouncement()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data)
                }
                else {
                    setData([])
                }
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            })
            .catch((err) => {
                toast.error("Something Went Wrong")
                console.log("Error is ", err);
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
    })
    return (
        <>
            <main id="main" className="main">
                <EmployeePageTitle child="Announcements" />

                {/* Loader */}
                {load ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                        <ScaleLoader color="#6776f4" />
                    </div>
                ) : (
                    <div className="container-fluid">
                        {data.length > 0 ? (
                            <div className="row justify-content-center">
                                <div className="col-lg-12 mt-3">
                                    {data.map((el, index) => (
                                        <div key={index} className="d-flex mb-4">
                                            <div className="message-bubble" style={styles.adminBubble}>
                                                <div className="d-flex align-items-center mb-1 flex-wrap">
                                                    <p className="mb-0 fw-bold" style={styles.messageText}>
                                                        {el?.createdBy?.name || "Admin"}
                                                    </p>
                                                    <small className="ms-2" style={styles.time}>
                                                        {moment(el.createdAt).fromNow()}
                                                    </small>

                                                    {/* Optional edited timestamp */}
                                                    {el?.updatedAt && el.updatedAt !== el.createdAt && (
                                                        <small className="ms-2 text-muted" style={styles.editedTime}>
                                                            (edited {moment(el.updatedAt).format("hh:mm A, MMM D")})
                                                        </small>
                                                    )}
                                                </div>

                                                <p className="mb-1 fw-semibold" style={styles.title}>
                                                    {el?.title}
                                                </p>
                                                <p className="mb-1" style={styles.announcementText}>
                                                    {el?.message}
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

        </>
    )
}
const styles = {
  adminBubble: {
    backgroundColor: "#eaf3ff",
    padding: "12px 18px",
    borderRadius: "16px",
    maxWidth: "75%",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  messageText: {
    fontSize: "15px",
    color: "#333",
  },
  time: {
    fontSize: "12px",
    color: "#888",
  },
  editedTime: {
    fontSize: "12px",
    color: "#999",
  },
  title: {
    fontSize: "16px",
    color: "#2c3e50",
  },
  announcementText: {
    fontSize: "14px",
    color: "#444",
    whiteSpace: "pre-line",
  },
};