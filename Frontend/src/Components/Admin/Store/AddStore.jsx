import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddStore() {
    const nav = useNavigate();

    const [storeName, setStoreName] = useState("");
    const [storeCode, setStoreCode] = useState("");
    const [address, setAddress] = useState("");

    const [storeCategoryName, setStoreCategoryName] = useState("");
    const [storeCategories, setStoreCategories] = useState([]);
    const [storeCategoryId, setStoreCategoryId] = useState("");

    const [zoneName, setZoneName] = useState("");
    const [zones, setZones] = useState([]);
    const [zoneId, setZoneId] = useState("");

    const [stateName, setStateName] = useState("");
    const [states, setStates] = useState([]);
    const [stateId, setStateId] = useState("");

    const [cityName, setCityName] = useState("");
    const [cities, setCities] = useState([]);

    const [load, setLoad] = useState(false);

    /* ================= LOAD MASTER DATA ================= */
    useEffect(() => {
        setLoad(true);

        ApiServices.GetAllStoreCategory({ status: "true" })
            .then(res => setStoreCategories(res?.data?.data || []));

        ApiServices.GetAllZone({ status: "true" })
            .then(res => setZones(res?.data?.data || []));

        setTimeout(() => setLoad(false), 800);
    }, []);

    /* ================= LOAD STATES BY ZONE ================= */
    const loadStatesByZone = (zId) => {
        setStates([]);
        setStateName("");
        setCityName("");
        setCities([]);

        ApiServices.GetAllState({ zoneId: zId })
            .then(res => setStates(res?.data?.data || []))
            .catch(() => setStates([]));
    };

    /* ================= LOAD CITIES BY STATE ================= */
    const loadCitiesByState = (sId) => {
        setCityName("");
        setCities([]);

        ApiServices.GetAllCity({ stateId: sId })
            .then(res => setCities(res?.data?.data || []))
            .catch(() => setCities([]));
    };

    /* ================= SUBMIT ================= */
    function handleForm(e) {
        e.preventDefault();

        if (!zoneId || !stateId || !cityName) {
            Swal.fire("Error", "Please select Zone, State and City", "error");
            return;
        }

        setLoad(true);

        const data = {
            storeName,
            storeCode,
            storeCategoryId,
            zoneId,
            stateId,
            cityName,
            address
        };

        ApiServices.AddStore(data)
            .then(res => {
                if (res?.data?.success) {
                    Swal.fire({
                        title: res.data.message,
                        icon: "success",
                        timer: 2000
                    });

                    setTimeout(() => {
                        nav("/admin/addStore");
                        setStoreName("");
                        setStoreCode("");
                        setStoreCategoryName("");
                        setZoneName("");
                        setStateName("");
                        setCityName("");
                        setAddress("");
                        setLoad(false);
                    }, 2000);
                } else {
                    Swal.fire("Error", res.data.message, "error");
                    setLoad(false);
                }
            })
            .catch(() => {
                Swal.fire("Error", "Something went wrong!", "error");
                setLoad(false);
            });
    }

    return (
        <main id="main" className="main">
            <PageTitle child="Add Store" />

            <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                loading={load}
            />

            <div className={load ? "display-screen" : ""}>
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Store Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>

                                {/* STORE NAME */}
                                <div className="col-12">
                                    <label className="form-label">Store Name</label>
                                    <input
                                        className="form-control"
                                        value={storeName}
                                        onChange={e => setStoreName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* STORE CODE */}
                                <div className="col-12">
                                    <label className="form-label">Store Code</label>
                                    <input
                                        className="form-control"
                                        value={storeCode}
                                        onChange={e => setStoreCode(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* STORE CATEGORY */}
                                <div className="col-12">
                                    <label className="form-label">Store Category</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                            {storeCategoryName || "Select Store Category"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {storeCategories.map(el => (
                                                <li key={el._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setStoreCategoryName(el.name);
                                                            setStoreCategoryId(el._id);
                                                        }}
                                                    >
                                                        {el.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* ZONE */}
                                <div className="col-12">
                                    <label className="form-label">Zone Name</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                            {zoneName || "Select a Zone"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {zones.map(el => (
                                                <li key={el._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setZoneName(el.zoneName);
                                                            setZoneId(el._id);
                                                            loadStatesByZone(el._id);
                                                        }}
                                                    >
                                                        {el.zoneName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* STATE */}
                                <div className="col-12">
                                    <label className="form-label">State Name</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown" disabled={!zoneId}>
                                            {stateName || "Select a State"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {states.map(el => (
                                                <li key={el._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setStateName(el.stateName);
                                                            setStateId(el._id);
                                                            loadCitiesByState(el._id);
                                                        }}
                                                    >
                                                        {el.stateName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CITY — FIXED */}
                                <div className="col-12">
                                    <label className="form-label">City Name</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown" disabled={!stateId}>
                                            {cityName || "Select a City"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {cities.length > 0 ? (
                                                cities.flatMap(el =>
                                                    Array.isArray(el.cityName)
                                                        ? el.cityName.map(name => (
                                                            <li key={el._id + name}>
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => setCityName(name)}
                                                                >
                                                                    {name}
                                                                </button>
                                                            </li>
                                                        ))
                                                        : (
                                                            <li key={el._id}>
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => setCityName(el.cityName)}
                                                                >
                                                                    {el.cityName}
                                                                </button>
                                                            </li>
                                                        )
                                                )
                                            ) : (
                                                <li className="dropdown-item text-muted">No Cities Found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="col-12">
                                    <label className="form-label">Store Location</label>
                                    <textarea
                                        className="form-control"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="text-center">
                                    <button className="btn" style={{ background: "#6776f4", color: "white" }}>
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
