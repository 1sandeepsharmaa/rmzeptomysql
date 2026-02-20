// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../../PageTitle";
// import { useEffect, useState } from "react";
// import ApiServices from "../../../ApiServices";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// export default function EditEmployee() {
//     const [name, setName] = useState("");
//     const [contact, setContact] = useState("");
//     const [email, setEmail] = useState("");
//     const [designation, setDesignation] = useState("");

//     // STORE
//     const [stores, setStores] = useState([]);
//     const [storeIds, setStoreIds] = useState([]);
//     const [storeOrder, setStoreOrder] = useState([]);

//     // ZONE
//     const [zones, setZones] = useState([]);
//     const [zoneId, setZoneId] = useState("");

//     const [load, setLoad] = useState(false);
//     const nav = useNavigate();
//     const params = useParams();
//     const location = useLocation();
//     const oldDesignation = location?.state?.designation;

//     // ================= LOAD =================
//     useEffect(() => {
//         setLoad(true);

//         let apiCall;
//         if (oldDesignation === "FM") apiCall = ApiServices.GetSingleFm;
//         else if (oldDesignation === "CLM") apiCall = ApiServices.GetSingleClm;
//         else if (oldDesignation === "Zonal_Head") apiCall = ApiServices.GetSingleZh;
//         else if (oldDesignation === "Zonal_Commercial")
//             apiCall = ApiServices.GetSingleZonalCommercial;
//         else if (oldDesignation === "Missing_Bridge")
//             apiCall = ApiServices.GetSingleMissingBridge;
//         else if (oldDesignation === "Business_Finance")
//             apiCall = ApiServices.GetSingleBf;
//         else if (oldDesignation === "Procurement")
//             apiCall = ApiServices.GetSingleProcurement;
//         else if (oldDesignation === "PR/PO")
//             apiCall = ApiServices.GetSinglePrPo;
//         else return;

//         apiCall({ _id: params.id }).then((res) => {
//             const emp = res?.data?.data;
//             setName(emp?.name);
//             setContact(emp?.contact);
//             setEmail(emp?.email);
//             setDesignation(emp?.designation);

//             const ids = emp?.storeId?.map((s) => s._id) || [];
//             setStoreIds(ids);
//             setStoreOrder(ids);

//             // zone prefill ONLY if exists
//             if (emp?.zoneId) setZoneId(emp.zoneId);

//             setTimeout(() => setLoad(false), 800);
//         });

//         ApiServices.GetAllStore({ status: "true" })
//             .then((res) => setStores(res?.data?.data || []))
//             .catch(() => { });

//         ApiServices.GetAllZone?.({ status: "true" })
//             .then((res) => setZones(res?.data?.data || []))
//             .catch(() => { });
//     }, []);

//     // ================= STORE TOGGLE =================
//     const handleStoreToggle = (store) => {
//         let ids = [...storeIds];
//         let order = [...storeOrder];

//         if (ids.includes(store._id)) {
//             ids = ids.filter((id) => id !== store._id);
//             order = order.filter((id) => id !== store._id);
//         } else {
//             ids.push(store._id);
//             order.push(store._id);
//         }

//         setStoreIds(ids);
//         setStoreOrder(order);
//     };

//     const getStoreNumber = (id) => {
//         const index = storeOrder.indexOf(id);
//         return index !== -1 ? index + 1 : null;
//     };

//     // ================= SUBMIT =================
//     function handleForm(e) {
//         e.preventDefault();
//         setLoad(true);

//         let payload = {
//             _id: params.id,
//             name,
//             contact,
//             storeId: storeIds,
//             newDesignation: designation,
//             oldDesignation,
//         };

//         // ✅ zone ONLY for ZH & Missing Bridge
//         if (["Zonal_Head", "Missing_Bridge"].includes(designation)) {
//             payload.zoneId = zoneId;
//         }

//         let apiCall;
//         if (oldDesignation !== designation) {
//             apiCall = ApiServices.ChangeDesignation;
//         } else {
//             const updateMap = {
//                 FM: ApiServices.UpdateFm,
//                 CLM: ApiServices.UpdateClm,
//                 Zonal_Head: ApiServices.UpdateZh,
//                 Zonal_Commercial: ApiServices.UpdateZonalCommercial,
//                 Missing_Bridge: ApiServices.UpdateMissingBridge,
//                 Business_Finance: ApiServices.UpdateBf,
//                 Procurement: ApiServices.UpdateProcurement,
//                 "PR/PO": ApiServices.UpdatePrPo,
//             };
//             apiCall = updateMap[oldDesignation];
//         }

//         apiCall(payload)
//             .then((res) => {
//                 Swal.fire("Success", res.data.message, "success");
//                 setTimeout(() => {
//                     setLoad(false);
//                     nav("/admin/manageEmployee");
//                 }, 2000);
//             })
//             .catch(() => {
//                 Swal.fire("Error", "Something went wrong", "error");
//                 setLoad(false);
//             });
//     }

//     return (
//         <main id="main" className="main">
//             <PageTitle child="Edit Employee" />

//             <ScaleLoader
//                 color="#6776f4"
//                 cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//                 loading={load}
//             />

//             <div className={load ? "display-screen" : ""}>
//                 <div className="col-lg-6 mx-auto mt-3">
//                     <div className="card">
//                         <div className="card-body">
//                             <h5 className="card-title">Employee Details</h5>

//                             <form className="row g-3" onSubmit={handleForm}>
//                                 <div className="col-12">
//                                     <label>Name</label>
//                                     <input
//                                         className="form-control"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-12">
//                                     <label>Email</label>
//                                     <input className="form-control" value={email} disabled />
//                                 </div>

//                                 <div className="col-12">
//                                     <label>Contact</label>
//                                     <input
//                                         className="form-control"
//                                         value={contact}
//                                         onChange={(e) => setContact(e.target.value)}
//                                         required
//                                     />
//                                 </div>

//                                 {/* DESIGNATION */}
//                                 <div className="col-12">
//                                     <label>Designation</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             {designation}
//                                         </button>
//                                         <ul className="dropdown-menu w-100">
//                                             {[
//                                                 "FM",
//                                                 "CLM",
//                                                 "Zonal_Head",
//                                                 "Zonal_Commercial",
//                                                 "Missing_Bridge",
//                                                 "Business_Finance",
//                                                 "Procurement",
//                                                 "PR/PO",
//                                             ].map((d) => (
//                                                 <li key={d}>
//                                                     <button
//                                                         className="dropdown-item"
//                                                         type="button"
//                                                         onClick={() => setDesignation(d)}
//                                                     >
//                                                         {d}
//                                                     </button>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* STORE */}
//                                 <div className="col-12">
//                                     <label>Store</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             {storeIds.length > 0
//                                                 ? `${storeIds.length} Store${storeIds.length > 1 ? "s" : ""
//                                                 } Selected`
//                                                 : "Select Store"}
//                                         </button>

//                                         <ul className="dropdown-menu w-100">
//                                             {stores.map((el) => (
//                                                 <li
//                                                     key={el._id}
//                                                     className="dropdown-item d-flex justify-content-between"
//                                                 >
//                                                     <div className="form-check">
//                                                         <input
//                                                             type="checkbox"
//                                                             className="form-check-input me-2"
//                                                             checked={storeIds.includes(el._id)}
//                                                             onChange={() => handleStoreToggle(el)}
//                                                         />
//                                                         {el.storeName}
//                                                     </div>
//                                                     {getStoreNumber(el._id) && (
//                                                         <span className="badge bg-primary">
//                                                             {getStoreNumber(el._id)}
//                                                         </span>
//                                                     )}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* ZONE – ONLY FOR ZH & MISSING BRIDGE */}
//                                 {["Zonal_Head", "Missing_Bridge"].includes(designation) && (
//                                     <div className="col-12">
//                                         <label>Zone</label>
//                                         <div className="dropdown">
//                                             <button
//                                                 className="form-control text-start dropdown-toggle"
//                                                 data-bs-toggle="dropdown"
//                                             >
//                                                 {zoneId
//                                                     ? zones.find((z) => z._id === zoneId)?.zoneName
//                                                     : "Select Zone"}
//                                             </button>
//                                             <ul className="dropdown-menu w-100">
//                                                 {zones.map((z) => (
//                                                     <li key={z._id}>
//                                                         <button
//                                                             className="dropdown-item"
//                                                             type="button"
//                                                             onClick={() => setZoneId(z._id)}
//                                                         >
//                                                             {z.zoneName}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="text-center">
//                                     <button
//                                         className="btn"
//                                         style={{ background: "#6776f4", color: "white" }}
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }


// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../../PageTitle";
// import { useEffect, useState } from "react";
// import ApiServices from "../../../ApiServices";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// export default function EditEmployee() {
//     const [name, setName] = useState("");
//     const [contact, setContact] = useState("");
//     const [email, setEmail] = useState("");
//     const [designation, setDesignation] = useState("");

//     // STORE
//     const [stores, setStores] = useState([]);
//     const [storeIds, setStoreIds] = useState([]);
//     const [storeOrder, setStoreOrder] = useState([]);

//     // ZONE
//     const [zones, setZones] = useState([]);
//     const [zoneId, setZoneId] = useState("");

//     const [load, setLoad] = useState(false);
//     const nav = useNavigate();
//     const params = useParams();
//     const location = useLocation();
//     const oldDesignation = location?.state?.designation;

//     // ================= LOAD =================
//     useEffect(() => {
//         setLoad(true);

//         let apiCall;
//         if (oldDesignation === "FM") apiCall = ApiServices.GetSingleFm;
//         else if (oldDesignation === "CLM") apiCall = ApiServices.GetSingleClm;
//         else if (oldDesignation === "Zonal_Head") apiCall = ApiServices.GetSingleZh;
//         else if (oldDesignation === "Zonal_Commercial")
//             apiCall = ApiServices.GetSingleZonalCommercial;
//         else if (oldDesignation === "Missing_Bridge")
//             apiCall = ApiServices.GetSingleMissingBridge;
//         else if (oldDesignation === "Business_Finance")
//             apiCall = ApiServices.GetSingleBf;
//         else if (oldDesignation === "Procurement")
//             apiCall = ApiServices.GetSingleProcurement;
//         else if (oldDesignation === "PR/PO")
//             apiCall = ApiServices.GetSinglePrPo;
//         else return;

//         apiCall({ _id: params.id }).then((res) => {
//             const emp = res?.data?.data;
//             setName(emp?.name);
//             setContact(emp?.contact);
//             setEmail(emp?.email);
//             setDesignation(emp?.designation);

//             const ids = emp?.storeId?.map((s) => s._id) || [];
//             setStoreIds(ids);
//             setStoreOrder(ids);

//             if (emp?.zoneId) setZoneId(emp.zoneId);

//             setLoad(false);
//         });

//         ApiServices.GetAllStore({ status: "true" })
//             .then((res) => setStores(res?.data?.data || []))
//             .catch(() => { });

//         ApiServices.GetAllZone?.({ status: "true" })
//             .then((res) => setZones(res?.data?.data || []))
//             .catch(() => { });
//     }, []);

//     // ================= STORE TOGGLE =================
//     const handleStoreToggle = (store) => {
//         let ids = [...storeIds];
//         let order = [...storeOrder];

//         if (ids.includes(store._id)) {
//             ids = ids.filter((id) => id !== store._id);
//             order = order.filter((id) => id !== store._id);
//         } else {
//             ids.push(store._id);
//             order.push(store._id);
//         }

//         setStoreIds(ids);
//         setStoreOrder(order);
//     };

//     const getStoreNumber = (id) => {
//         const index = storeOrder.indexOf(id);
//         return index !== -1 ? index + 1 : null;
//     };

//     // ================= SUBMIT =================
//     function handleForm(e) {
//         e.preventDefault();
//         setLoad(true);

//         let payload = {
//             _id: params.id,
//             name,
//             contact,
//             storeId: storeIds,
//             newDesignation: designation,
//             oldDesignation,
//         };

//         if (["Zonal_Head", "Missing_Bridge"].includes(designation)) {
//             payload.zoneId = zoneId;
//         }

//         let apiCall;
//         if (oldDesignation !== designation) {
//             apiCall = ApiServices.ChangeDesignation;
//         } else {
//             const updateMap = {
//                 FM: ApiServices.UpdateFm,
//                 CLM: ApiServices.UpdateClm,
//                 Zonal_Head: ApiServices.UpdateZh,
//                 Zonal_Commercial: ApiServices.UpdateZonalCommercial,
//                 Missing_Bridge: ApiServices.UpdateMissingBridge,
//                 Business_Finance: ApiServices.UpdateBf,
//                 Procurement: ApiServices.UpdateProcurement,
//                 "PR/PO": ApiServices.UpdatePrPo,
//             };
//             apiCall = updateMap[oldDesignation];
//         }

//         apiCall(payload)
//             .then((res) => {
//                 Swal.fire("Success", res.data.message, "success");
//                 setTimeout(() => {
//                     setLoad(false);
//                     nav("/admin/manageEmployee");
//                 }, 2000);
//             })
//             .catch(() => {
//                 Swal.fire("Error", "Something went wrong", "error");
//                 setLoad(false);
//             });
//     }

//     return (
//         <main id="main" className="main">
//             <PageTitle child="Edit Employee" />

//             <ScaleLoader
//                 color="#6776f4"
//                 cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//                 loading={load}
//             />

//             <div className={load ? "display-screen" : ""}>
//                 <div className="col-lg-6 mx-auto mt-3">
//                     <div className="card">
//                         <div className="card-body">
//                             <h5 className="card-title">Employee Details</h5>

//                             <form className="row g-3" onSubmit={handleForm}>
//                                 <div className="col-12">
//                                     <label>Name</label>
//                                     <input
//                                         className="form-control"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-12">
//                                     <label>Email</label>
//                                     <input className="form-control" value={email} disabled />
//                                 </div>

//                                 <div className="col-12">
//                                     <label>Contact</label>
//                                     <input
//                                         className="form-control"
//                                         value={contact}
//                                         onChange={(e) => setContact(e.target.value)}
//                                         required
//                                     />
//                                 </div>

//                                 {/* DESIGNATION */}
//                                 <div className="col-12">
//                                     <label>Designation</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             {designation}
//                                         </button>
//                                         <ul className="dropdown-menu w-100">
//                                             {[
//                                                 "FM",
//                                                 "CLM",
//                                                 "Zonal_Head",
//                                                 "Zonal_Commercial",
//                                                 "Missing_Bridge",
//                                                 "Business_Finance",
//                                                 "Procurement",
//                                                 "PR/PO",
//                                             ].map((d) => (
//                                                 <li key={d}>
//                                                     <button
//                                                         className="dropdown-item"
//                                                         type="button"
//                                                         onClick={() => setDesignation(d)}
//                                                     >
//                                                         {d}
//                                                     </button>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* STORE */}
//                                 <div className="col-12">
//                                     <label>Store</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             {storeIds.length > 0
//                                                 ? `${storeIds.length} Store${storeIds.length > 1 ? "s" : ""
//                                                 } Selected`
//                                                 : "Select Store"}
//                                         </button>

//                                         <ul className="dropdown-menu w-100">
//                                             {stores.map((el) => (
//                                                 <li
//                                                     key={el._id}
//                                                     className="dropdown-item d-flex justify-content-between"
//                                                 >
//                                                     <div className="form-check">
//                                                         <input
//                                                             type="checkbox"
//                                                             className="form-check-input me-2"
//                                                             checked={storeIds.includes(el._id)}
//                                                             onChange={() => handleStoreToggle(el)}
//                                                         />
//                                                         {el.storeName}
//                                                     </div>
//                                                     {getStoreNumber(el._id) && (
//                                                         <span className="badge bg-primary">
//                                                             {getStoreNumber(el._id)}
//                                                         </span>
//                                                     )}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* ZONE */}
//                                 {["Zonal_Head", "Missing_Bridge"].includes(designation) && (
//                                     <div className="col-12">
//                                         <label>Zone</label>
//                                         <div className="dropdown">
//                                             <button
//                                                 className="form-control text-start dropdown-toggle"
//                                                 data-bs-toggle="dropdown"
//                                             >
//                                                 {zoneId
//                                                     ? zones.find((z) => z._id === zoneId)?.zoneName
//                                                     : "Select Zone"}
//                                             </button>
//                                             <ul className="dropdown-menu w-100">
//                                                 {zones.map((z) => (
//                                                     <li key={z._id}>
//                                                         <button
//                                                             className="dropdown-item"
//                                                             type="button"
//                                                             onClick={() => setZoneId(z._id)}
//                                                         >
//                                                             {z.zoneName}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* BUTTONS */}
//                                 <div className="text-center mt-3 d-flex justify-content-center gap-2">
//                                     <button
//                                         className="btn"
//                                         style={{ background: "#6776f4", color: "white" }}
//                                     >
//                                         Submit
//                                     </button>

//                                     <button
//                                         type="button"
//                                         className="btn btn-warning"
//                                         onClick={() =>
//                                             nav(`/admin/change-password/${params.id}`)
//                                         }
//                                     >
//                                         Change Password
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }


import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditEmployee() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");

    // STORE
    const [stores, setStores] = useState([]);
    const [storeIds, setStoreIds] = useState([]);
    const [storeOrder, setStoreOrder] = useState([]);

    // ZONE
    const [zones, setZones] = useState([]);
    const [zoneId, setZoneId] = useState("");

    // LOADERS
    const [pageLoading, setPageLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // CHANGE PASSWORD MODAL
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState("");
    const nav = useNavigate();
    const params = useParams();
    const location = useLocation();
    const oldDesignation = location?.state?.designation;

    // ================= LOAD EMPLOYEE =================
    useEffect(() => {
        setPageLoading(true);

        let apiCall;
        if (oldDesignation === "FM") apiCall = ApiServices.GetSingleFm;
        else if (oldDesignation === "CLM") apiCall = ApiServices.GetSingleClm;
        else if (oldDesignation === "Zonal_Head") apiCall = ApiServices.GetSingleZh;
        else if (oldDesignation === "Zonal_Commercial") apiCall = ApiServices.GetSingleZonalCommercial;
        else if (oldDesignation === "Missing_Bridge") apiCall = ApiServices.GetSingleMissingBridge;
        else if (oldDesignation === "Business_Finance") apiCall = ApiServices.GetSingleBf;
        else if (oldDesignation === "Procurement") apiCall = ApiServices.GetSingleProcurement;
        else if (oldDesignation === "PR/PO") apiCall = ApiServices.GetSinglePrPo;
        else return;

        apiCall({ _id: params.id }).then((res) => {
            const emp = res?.data?.data;
            setUserId(emp?.userId || "");
            setName(emp?.name || "");
            setContact(emp?.contact || "");
            setEmail(emp?.email || "");
            setDesignation(emp?.designation || "");

            const ids = emp?.storeId?.map((s) => s._id) || [];
            setStoreIds(ids);
            setStoreOrder(ids);

            if (emp?.zoneId) setZoneId(emp.zoneId);

            setPageLoading(false);
        });

        ApiServices.GetAllStore({ status: "true" })
            .then((res) => setStores(res?.data?.data || []));

        ApiServices.GetAllZone({ status: "true" })
            .then((res) => setZones(res?.data?.data || []));
    }, []);

    // ================= STORE HANDLING =================
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

    // ================= UPDATE EMPLOYEE =================
    const handleForm = (e) => {
        e.preventDefault();
        setPageLoading(true);

        let payload = {
            _id: params.id,
            name,
            contact,
            storeId: storeIds,
            newDesignation: designation,
            oldDesignation,
        };

        if (["Zonal_Head", "Missing_Bridge"].includes(designation)) {
            payload.zoneId = zoneId;
        }

        let apiCall;
        if (oldDesignation !== designation) {
            apiCall = ApiServices.ChangeDesignation;
        } else {
            const map = {
                FM: ApiServices.UpdateFm,
                CLM: ApiServices.UpdateClm,
                Zonal_Head: ApiServices.UpdateZh,
                Zonal_Commercial: ApiServices.UpdateZonalCommercial,
                Missing_Bridge: ApiServices.UpdateMissingBridge,
                Business_Finance: ApiServices.UpdateBf,
                Procurement: ApiServices.UpdateProcurement,
                "PR/PO": ApiServices.UpdatePrPo,
            };
            apiCall = map[oldDesignation];
        }

        apiCall(payload)
            .then((res) => {
                Swal.fire("Success", res.data.message, "success");
                setPageLoading(false);
                nav("/admin/manageEmployee");
            })
            .catch(() => {
                Swal.fire("Error", "Something went wrong", "error");
                setPageLoading(false);
            });
    };
    // ================= CHANGE PASSWORD =================
    const handleChangePassword = () => {
        if (!newPassword || !confirmPassword) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match", "error");
            return;
        }

        setPasswordLoading(true);

        ApiServices.ChangePassword({
            _id: userId,
            newpassword: newPassword,
            confirmpassword: confirmPassword,
        })
            .then((res) => {
                Swal.fire("Success", res.data.message, "success");
                console.log(res.data)
                setShowPasswordModal(false);
                setNewPassword("");
                setConfirmPassword("");
                setPasswordLoading(false);
            })
            .catch(() => {
                Swal.fire("Error", "Password not updated", "error");
                setPasswordLoading(false);
            });
    };

    return (
        <main id="main" className="main">
            <PageTitle child="Edit Employee" />

            <ScaleLoader
                loading={pageLoading}
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            />

            <div className={pageLoading ? "display-screen" : ""}>
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Employee Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>
                                <div className="col-12">
                                    <label>Name</label>
                                    <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label>Email</label>
                                    <input className="form-control" value={email} disabled />
                                </div>

                                <div className="col-12">
                                    <label>Contact</label>
                                    <input className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label>Designation</label>
                                    <div className="dropdown">
                                        <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                            {designation}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {["FM", "CLM", "Zonal_Head", "Zonal_Commercial", "Missing_Bridge", "Business_Finance", "Procurement", "PR/PO"].map((d) => (
                                                <li key={d}>
                                                    <button type="button" className="dropdown-item" onClick={() => setDesignation(d)}>
                                                        {d}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label>Store</label>
                                    <div className="dropdown">
                                        <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                            {storeIds.length ? `${storeIds.length} Store Selected` : "Select Store"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {stores.map((el) => (
                                                <li key={el._id} className="dropdown-item d-flex justify-content-between">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input me-2" checked={storeIds.includes(el._id)} onChange={() => handleStoreToggle(el)} />
                                                        {el.storeName}
                                                    </div>
                                                    {getStoreNumber(el._id) && <span className="badge bg-primary">{getStoreNumber(el._id)}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {["Zonal_Head", "Missing_Bridge"].includes(designation) && (
                                    <div className="col-12">
                                        <label>Zone</label>
                                        <div className="dropdown">
                                            <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                                {zoneId ? zones.find((z) => z._id === zoneId)?.zoneName : "Select Zone"}
                                            </button>
                                            <ul className="dropdown-menu w-100">
                                                {zones.map((z) => (
                                                    <li key={z._id}>
                                                        <button type="button" className="dropdown-item" onClick={() => setZoneId(z._id)}>
                                                            {z.zoneName}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mt-3 d-flex justify-content-center gap-2">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                    <button type="button" className="btn btn-warning" onClick={() => setShowPasswordModal(true)}>
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Change Password</h5>
                                <button className="btn-close" onClick={() => setShowPasswordModal(false)} />
                            </div>
                            <div className="modal-body">
                                <input className="form-control mb-2" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <input className="form-control" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button className="btn btn-success" disabled={passwordLoading} onClick={handleChangePassword}>
                                    {passwordLoading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
