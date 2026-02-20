import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddState() {

  const [zoneName, setZoneName] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [zones, setZones] = useState([]);

  const [stateName, setStateName] = useState("");   // ✅ STRING
  const [states, setStates] = useState([]);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);

    ApiServices.GetAllZone({ status: "true" })
      .then(res => setZones(res?.data?.data || []))
      .catch(() => {});

    ApiServices.GetAllStates()
      .then(res => setStates(res?.data?.data || []))
      .catch(() => {});

    setTimeout(() => setLoad(false), 1000);
  }, []);

  const handleForm = (e) => {
    e.preventDefault();

    if (!zoneId) {
      Swal.fire("Error", "Please select Zone", "error");
      return;
    }

    if (!stateName) {
      Swal.fire("Error", "Please select State", "error");
      return;
    }

    setLoad(true);

    ApiServices.AddState({
      zoneId,
      stateName   // ✅ STRING send hoga
    })
      .then(res => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", "State Added Successfully", "success");
          setZoneName("");
          setZoneId("");
          setStateName("");
        } else {
          Swal.fire("Error", res?.data?.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  };

  return (
    <main id="main" className="main">
      <PageTitle child="Add State" />

      <div className="container-fluid">
        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />

        <div className={load ? "display-screen" : ""}>
          <div className="col-lg-6 mx-auto mt-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">State Details</h5>

                <form className="row g-3" onSubmit={handleForm}>

                  {/* ========== ZONE DROPDOWN ========== */}
                  <div className="col-12">
                    <label className="form-label">Zone Name</label>
                    <div className="dropdown">
                      <button
                        className="form-control text-start dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        {zoneName || "Select a Zone"}
                      </button>
                      <ul className="dropdown-menu w-100">
                        {zones.map(z => (
                          <li key={z._id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setZoneName(z.zoneName);
                                setZoneId(z._id);
                                setStateName("");
                              }}
                            >
                              {z.zoneName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ========== STATE DROPDOWN (SAME AS ZONE) ========== */}
                  <div className="col-12">
                    <label className="form-label">State Name</label>
                    <div className="dropdown">
                      <button
                        className="form-control text-start dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        disabled={!zoneId}
                      >
                        {stateName || "Select a State"}
                      </button>

                      <ul
                        className="dropdown-menu w-100"
                        style={{ maxHeight: "220px", overflowY: "auto" }}
                      >
                        {states.map(state => (
                          <li key={state._id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setStateName(state.name)}
                            >
                              {state.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn"
                      style={{ background: "#6776f4", color: "white" }}
                    >
                      Submit
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
