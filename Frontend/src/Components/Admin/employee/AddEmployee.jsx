import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [designation, setDesignation] = useState("");

  // STORE
  const [stores, setStores] = useState([]);
  const [storeIds, setStoreIds] = useState([]);
  const [storeOrder, setStoreOrder] = useState([]);
  const [storeSearch, setStoreSearch] = useState("");

  // ZONE
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");

  const [load, setLoad] = useState(false);
  const nav = useNavigate();

  // ================= LOAD DATA =================
  useEffect(() => {
    setLoad(true);

    ApiServices.GetAllStore({ status: "true" })
      .then((res) => setStores(res?.data?.data || []))
      .catch(() => {});

    ApiServices.GetAllZone?.({ status: "true" })
      .then((res) => setZones(res?.data?.data || []))
      .catch(() => {});

    setTimeout(() => setLoad(false), 800);
  }, []);

  // ================= STORE TOGGLE =================
  const handleStoreToggle = (store) => {
    let ids = [...storeIds];
    let order = [...storeOrder];

    if (ids.includes(store._id)) {
      ids = ids.filter((id) => id !== store._id);
      order = order.filter((id) => id !== store._id);
    } else {
      ids.push(store._id);
      order.push(store._id);
    }

    setStoreIds(ids);
    setStoreOrder(order);
  };

  const getStoreNumber = (id) => {
    const index = storeOrder.indexOf(id);
    return index !== -1 ? index + 1 : null;
  };

  // ================= SUBMIT =================
  const handleForm = (e) => {
    e.preventDefault();
    setLoad(true);

    let data = {
      name,
      email,
      password,
      contact,
      storeId: storeIds,
    };

    // ✅ zone ONLY for these roles
    if (["Zonal_Head", "Missing_Bridge"].includes(designation)) {
      data.zoneId = zoneId;
    }

    let apiCall;
    if (designation === "FM") apiCall = ApiServices.AddFm;
    else if (designation === "CLM") apiCall = ApiServices.AddClm;
    else if (designation === "Zonal_Head") apiCall = ApiServices.AddZh;
    else if (designation === "Zonal_Commercial")
      apiCall = ApiServices.AddZonalCommercial;
    else if (designation === "Missing_Bridge")
      apiCall = ApiServices.AddMissingBridge;
    else if (designation === "Business_Finance") apiCall = ApiServices.AddBf;
    else if (designation === "Procurement")
      apiCall = ApiServices.AddProcurement;
    else if (designation === "PR/PO") apiCall = ApiServices.AddPrPo;
    else {
      Swal.fire("Error", "Please select designation", "error");
      setLoad(false);
      return;
    }

    apiCall(data)
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          setTimeout(() => {
            nav("/admin/addEmployee");
            setName("");
            setEmail("");
            setPassword("");
            setContact("");
            setDesignation("");
            setStoreIds([]);
            setStoreOrder([]);
            setZoneId("");
            setLoad(false);
          }, 2000);
        } else {
          Swal.fire("Error", res.data.message, "error");
          setLoad(false);
        }
      })
      .catch(() => {
        Swal.fire("Error", "Something went wrong", "error");
        setLoad(false);
      });
  };

  return (
    <main id="main" className="main">
      <PageTitle child="Add Employee" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      <div className={load ? "display-screen" : ""}>
        <div className="col-lg-6 mx-auto mt-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Employee Details</h5>

              <form className="row g-3" onSubmit={handleForm}>
                <div className="col-12">
                  <label>Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label>Contact</label>
                  <input
                    type="tel"
                    maxLength="10"
                    className="form-control"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                {/* DESIGNATION */}
                <div className="col-12">
                  <label>Designation</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {designation || "Select Designation"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {[
                        "FM",
                        "CLM",
                        "Zonal_Head",
                        "Zonal_Commercial",
                        "Missing_Bridge",
                        "Business_Finance",
                        "Procurement",
                        "PR/PO",
                      ].map((d) => (
                        <li key={d}>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => setDesignation(d)}
                          >
                            {d}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* STORE */}
                <div className="col-12">
                  <label>Store</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {storeIds.length > 0
                        ? `${storeIds.length} Store${storeIds.length > 1 ? "s" : ""} Selected`
                        : "Select Store"}
                    </button>

                    <ul className="dropdown-menu w-100 p-2">
                      {/* Search Input */}
                      <li>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Search store..."
                          value={storeSearch}
                          onChange={(e) => setStoreSearch(e.target.value)}
                        />
                      </li>

                      {/* Filtered Stores */}
                      {stores
                        .filter((el) =>
                          el.storeName
                            .toLowerCase()
                            .includes(storeSearch.toLowerCase()),
                        )
                        .map((el) => (
                          <li
                            key={el._id}
                            className="dropdown-item d-flex justify-content-between align-items-center"
                          >
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={storeIds.includes(el._id)}
                                onChange={() => handleStoreToggle(el)}
                              />
                              <label className="form-check-label">
                                {el.storeName}
                              </label>
                            </div>

                            {getStoreNumber(el._id) && (
                              <span className="badge bg-primary">
                                {getStoreNumber(el._id)}
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* ZONE – ONLY FOR ZH & MISSING BRIDGE */}
                {["Zonal_Head", "Missing_Bridge"].includes(designation) && (
                  <div className="col-12">
                    <label>Zone</label>
                    <div className="dropdown">
                      <button
                        className="form-control text-start dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        {zoneId
                          ? zones.find((z) => z._id === zoneId)?.zoneName
                          : "Select Zone"}
                      </button>
                      <ul className="dropdown-menu w-100">
                        {zones.map((z) => (
                          <li key={z._id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setZoneId(z._id)}
                            >
                              {z.zoneName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    className="btn"
                    style={{ background: "#6776f4", color: "#fff" }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
