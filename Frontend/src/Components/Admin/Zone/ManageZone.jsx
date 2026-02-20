import { toast, ToastContainer } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManageZone() {
  var [data, setData] = useState([]);
  var [load, setLoad] = useState(true);

  useEffect(() => {
    ApiServices.GetAllZone()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => {
          setLoad(false);
        }, 500);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      });
  }, [load]);

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
        let data = {
          _id: id,
          status: "false",
        };
        ApiServices.ChangeStatusZone(data)
          .then((res) => {
            setLoad(true);
            var message = res?.data?.message;
            Swal.fire({
              title: message,
              icon: res.data.success ? "success" : "error",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => setLoad(false), 1500);
          })
          .catch((err) => {
            setLoad(true);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
              timerProgressBar: true,
            });
            setTimeout(() => setLoad(false), 2000);
            console.log("Error is", err);
          });
      }
    });
  }

  const activeZones = data?.filter((el) => el.status === true);

  return (
    <>
      <main className="main" id="main">
        <PageTitle child="Manage Zone" />
        <div className="container-fluid ">
          <div className="row">
            <div className="col-md-12">
              <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                size={200}
                loading={load}
              />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt-5 table-responsive">
              {!load && (
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Zone Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeZones?.length ? (
                      activeZones.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.zoneName}</td>
                          <td>
                            <span className="badge bg-success">Active</span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={"/admin/editZone/" + el._id}
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
                        <td colSpan={4} className="text-center text-muted">
                          No Active Zone Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
