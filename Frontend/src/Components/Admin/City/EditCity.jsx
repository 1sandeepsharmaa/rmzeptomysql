import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditCity() {
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

    const params = useParams();
    const nav = useNavigate();

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        setLoad(true);

        // Zones
        ApiServices.GetAllZone({ status: "true" })
            .then(res => setZones(res?.data?.data || []))
            .catch(() => { });

        // Get City Data
        ApiServices.GetSingleCity({ _id: params.id })
            .then(res => {
                const data = res?.data?.data;

                setZoneName(data?.zoneId?.zoneName);
                setZoneId(data?.zoneId?._id);

                setStateName(data?.stateName);
                setStateId(data?.stateId?._id);

                setSelectedCities(data?.cityName || []);

                // Load states for zone
                ApiServices.GetAllState({ zoneId: data?.zoneId?._id })
                    .then(r => setStates(r?.data?.data || []));

                // Load cities for state
                loadCities(data?.stateName);
            })
            .finally(() => setLoad(false));
    }, [params.id]);

    /* ================= LOAD STATES BY ZONE ================= */
    const loadStatesByZone = (zId) => {
        ApiServices.GetAllState({ zoneId: zId })
            .then(res => setStates(res?.data?.data || []))
            .catch(() => setStates([]));
    };

    /* ================= LOAD CITIES BY STATE ================= */
    const loadCities = (state) => {
        setCityLoading(true);
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

    /* ================= SUBMIT ================= */
    function handleForm(e) {
        e.preventDefault();

        if (!zoneId || !stateId || selectedCities.length === 0) {
            Swal.fire("Error", "Please select Zone, State and Cities", "error");
            return;
        }

        setLoad(true);

        ApiServices.UpdateCity({
            _id: params.id,
            zoneId,
            stateId,
            stateName,
            cityName: selectedCities
        })
            .then(res => {
                if (res?.data?.success) {
                    Swal.fire("Success", res.data.message, "success");
                    nav("/admin/manageCity");
                } else {
                    Swal.fire("Error", res?.data?.message, "error");
                }
            })
            .catch(() => Swal.fire("Error", "Something went wrong", "error"))
            .finally(() => setLoad(false));
    }

    /* ================= CITY BUTTON TEXT ================= */
    const cityButtonText =
        selectedCities.length === 0
            ? "Select City"
            : selectedCities.length <= 2
                ? selectedCities.join(", ")
                : `${selectedCities.slice(0, 2).join(", ")} +${selectedCities.length - 2} more`;

    return (
        <main id="main" className="main">
            <PageTitle child="Edit City" />

            <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                loading={load}
            />

            {!load && (
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">City Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>

                                {/* ZONE */}
                                <div className="col-12">
                                    <label className="form-label">Zone</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                            {zoneName || "Select Zone"}
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
                                                            setStateId("");
                                                            setStates([]);
                                                            setCities([]);
                                                            setSelectedCities([]);
                                                            loadStatesByZone(z._id);
                                                        }}
                                                    >
                                                        {z.zoneName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* STATE */}
                                <div className="col-12">
                                    <label className="form-label">State</label>
                                    <div className="dropdown">
                                        <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown" disabled={!zoneId}>
                                            {stateName || "Select State"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {states.map(s => (
                                                <li key={s._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setStateName(s.stateName);
                                                            setStateId(s._id);
                                                            loadCities(s.stateName);
                                                            setSelectedCities([]);
                                                        }}
                                                    >
                                                        {s.stateName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CITY */}
                                <div className="col-12">
                                    <label className="form-label">City</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control dropdown-toggle text-start"
                                            data-bs-toggle="dropdown"
                                            disabled={!stateId || cityLoading}
                                        >
                                            {cityLoading ? "Loading..." : cityButtonText}
                                        </button>

                                        <ul className="dropdown-menu w-100 p-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
                                            {cities.map(city => {
                                                const idx = selectedCities.indexOf(city);
                                                return (
                                                    <li key={city}>
                                                        <div className="form-check d-flex justify-content-between">
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
                                            })}
                                        </ul>
                                    </div>
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
            )}
        </main>
    );
}
