import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddCity() {
    const [zoneName, setZoneName] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [stateName, setStateName] = useState("");
    const [stateId, setStateId] = useState("");
    const [states, setStates] = useState([]);

    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);

    const [load, setLoad] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);

    /* ================= LOAD ZONES ================= */
    useEffect(() => {
        ApiServices.GetAllZone({ status: "true" })
            .then(res => setZones(res?.data?.data || []))
            .catch(() => { });
    }, []);

    /* ================= LOAD STATES BY ZONE ================= */
    const loadStatesByZone = (zId) => {
        setStates([]);
        setStateName("");
        setStateId("");
        setCities([]);
        setSelectedCities([]);

        ApiServices.GetAllState({ zoneId: zId })
            .then(res => setStates(res?.data?.data || []))
            .catch(() => setStates([]));
    };

    /* ================= LOAD CITIES BY STATE ================= */
    const loadCitiesByState = (state) => {
        setCityLoading(true);
        setCities([]);
        setSelectedCities([]);

        ApiServices.GetCitiesByState(state)
            .then(res => setCities(res?.data?.data || []))
            .catch(() => setCities([]))
            .finally(() => setCityLoading(false));
    };

    /* ================= CITY TOGGLE ================= */
    const toggleCity = (city) => {
        setSelectedCities(prev =>
            prev.includes(city)
                ? prev.filter(c => c !== city)
                : [...prev, city]
        );
    };

    /* ================= BUTTON TEXT ================= */
    const cityButtonText =
        selectedCities.length === 0
            ? "Select City"
            : selectedCities.length <= 2
                ? selectedCities.join(", ")
                : `${selectedCities.slice(0, 2).join(", ")} +${selectedCities.length - 2} more`;

    /* ================= SUBMIT ================= */
    const handleForm = (e) => {
        e.preventDefault();

        if (!zoneId || !stateId || selectedCities.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please select Zone, State and City",
            });
            return;
        }

        setLoad(true);

        ApiServices.AddCity({
            zoneId,
            stateId,
            stateName,
            cityName: selectedCities   // ✅ city array allowed
        })
            .then(res => {
                if (res?.data?.success) {
                    Swal.fire("Success", "City Added Successfully", "success");

                    setZoneName("");
                    setZoneId("");
                    setStateName("");
                    setStateId("");
                    setStates([]);
                    setCities([]);
                    setSelectedCities([]);
                } else {
                    Swal.fire("Error", res?.data?.message, "error");
                }
            })
            .catch(() => Swal.fire("Error", "Server Error", "error"))
            .finally(() => setLoad(false));
    };

    return (
        <main id="main" className="main">
            <PageTitle child="Add City" />

            {load && (
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    loading={load}
                />
            )}

            {!load && (
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">City Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>

                                {/* ================= ZONE ================= */}
                                <div className="col-12">
                                    <label className="form-label">Zone Name</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control text-start dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            {zoneName || "Select a Zone"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {zones.length > 0 ? zones.map(z => (
                                                <li key={z._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setZoneName(z.zoneName);
                                                            setZoneId(z._id);
                                                            loadStatesByZone(z._id);
                                                        }}
                                                    >
                                                        {z.zoneName}
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="dropdown-item text-muted">
                                                    No Zones Found
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ================= STATE (SINGLE) ================= */}
                                <div className="col-12">
                                    <label className="form-label">State Name</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control text-start dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            disabled={!zoneId}
                                        >
                                            {stateName || "Select a State"}
                                        </button>

                                        <ul
                                            className="dropdown-menu w-100"
                                            style={{ maxHeight: "220px", overflowY: "auto" }}
                                        >
                                            {states.length > 0 ? (
                                                states.map(s => (
                                                    <li key={s._id}>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item"
                                                            onClick={() => {
                                                                setStateName(s.stateName);
                                                                setStateId(s._id);
                                                                loadCitiesByState(s.stateName);
                                                            }}
                                                        >
                                                            {s.stateName}
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="dropdown-item text-muted">
                                                    No States Found
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ================= CITY (MULTI) ================= */}
                                <div className="col-12">
                                    <label className="form-label">City Name</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control text-start dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                            disabled={!stateId || cityLoading}
                                        >
                                            {cityLoading ? "Loading cities..." : cityButtonText}
                                        </button>

                                        <ul
                                            className="dropdown-menu w-100 p-2"
                                            style={{ maxHeight: "220px", overflowY: "auto" }}
                                        >
                                            {cities.length > 0 ? (
                                                cities.map((city, index) => {
                                                    const idx = selectedCities.indexOf(city);
                                                    return (
                                                        <li key={index}>
                                                            <div className="d-flex justify-content-between align-items-center form-check">
                                                                <label className="form-check-label">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input me-2"
                                                                        checked={idx !== -1}
                                                                        onChange={() => toggleCity(city)}
                                                                    />
                                                                    {city}
                                                                </label>

                                                                {idx !== -1 && (
                                                                    <span className="badge" style={{ background: "#6776f4" }}>
                                                                        {idx + 1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <li className="dropdown-item text-muted">
                                                    No Cities Found
                                                </li>
                                            )}
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
            )}
        </main>
    );
}
