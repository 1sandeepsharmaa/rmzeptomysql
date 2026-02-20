import { useState, useRef, useEffect } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";

export default function AddExpenses() {
  const nav = useNavigate();

  /* ================= STATES ================= */

  // Store
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Store Category
  const [storeCategoryName, setStoreCategoryName] = useState("");
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeCategoryId, setStoreCategoryId] = useState("");

  // Expense Head
  const [expenseHeadName, setExpenseHeadName] = useState("");
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [expenseHeadId, setExpenseHeadId] = useState("");

  // Expense
  const [natureOfExpense, setNatureOfExpense] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [remark, setRemark] = useState("");
  const [rca, setRca] = useState("");
  const [policy, setPolicy] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Attachment
  const [attachment, setAttachment] = useState([]);
  const fileInputRef = useRef(null);

  const [load, setLoad] = useState(false);
  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    setLoad(true);

    Promise.all([
      ApiServices.GetAllStore({ status: "true" }),
      ApiServices.GetAllStoreCategory({ status: "true" }),
      ApiServices.GetAllExpenseHead({ status: "true" }),
    ])
      .then(([storeRes, catRes, headRes]) => {
        setStores(storeRes?.data?.data || []);
        setStoreCategories(catRes?.data?.data || []);
        setExpenseHeads(headRes?.data?.data || []);
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= SUBMIT ================= */
  function handleForm(e) {
    e.preventDefault();
    if (load) return;

    if (
      !storeId ||
      !storeCategoryId ||
      !expenseHeadId ||
      !natureOfExpense ||
      !expenseValue ||
      !policy ||
      !ticketId ||
      attachment.length === 0
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const data = new FormData();
    data.append("storeId", storeId);
    data.append("storeCategoryId", storeCategoryId);
    data.append("expenseHeadId", expenseHeadId);
    data.append("natureOfExpense", natureOfExpense);
    data.append("amount", expenseValue);
    data.append("remark", remark);
    data.append("rca", rca);
    data.append("policy", policy);
    data.append("ticketId", ticketId);
    data.append("raisedBy", userId);
    attachment.forEach((file) => {
      data.append("attachment", file);  // 👈 SAME NAME
    });


    setLoad(true);

    ApiServices.AddExpense(data)
      .then((res) => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire({
            title: "Expense Added Successfully",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });

          /* ===== RESET FORM ===== */
          setStoreId("");
          setSearchStore("");
          setSelectedStore(null);
          setShowSearchDropdown(false);

          setStoreCategoryName("");
          setStoreCategoryId("");

          setExpenseHeadName("");
          setExpenseHeadId("");

          setNatureOfExpense("");
          setExpenseValue("");
          setRemark("");
          setRca("");
          setPolicy("");
          setTicketId("");

          setAttachment([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          const errorMsg = Array.isArray(res.data.message)
            ? res.data.message.join("<br>")
            : res.data.message;

          Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMsg,
          });
        }

      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  }

  const filteredStores = stores.filter((el) =>
    el.storeName.toLowerCase().includes(searchStore.toLowerCase())
  );

  return (
    <main className="main" id="main">
      <PageTitle child="Add Expenses" />

      <div className="container-fluid">
        <div className="col-lg-6 mx-auto mt-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Store Expense Details</h5>

              <form className="row g-3" onSubmit={handleForm}>
                {/* ===== STORE SEARCH ===== */}
                <div className="col-12 position-relative">
                  <label className="form-label">Store</label>
                  <input
                    type="text"
                    className="form-control dropdown-toggle"
                    placeholder="Search for store name..."
                    value={searchStore}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchStore(value);
                      setShowSearchDropdown(true);
                      if (value === "") {
                        setSelectedStore(null);
                        setStoreId("");
                        setStoreCategoryName("");
                        setStoreCategoryId("");
                        setExpenseHeadName("");
                        setExpenseHeadId("");
                        setPolicy("");
                      }
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowSearchDropdown(false), 150)
                    }
                  />

                  {showSearchDropdown && searchStore && (
                    <ul className="dropdown-menu show w-100">
                      {filteredStores.length ? (
                        filteredStores.map((el) => (
                          <li key={el._id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onMouseDown={() => {
                                setStoreId(el._id);
                                setSelectedStore(el);
                                setSearchStore(el.storeName);
                                setShowSearchDropdown(false);

                                if (el.storeCategoryId) {
                                  setStoreCategoryId(
                                    el.storeCategoryId._id ||
                                    el.storeCategoryId
                                  );
                                  setStoreCategoryName(
                                    el.storeCategoryId.name || ""
                                  );
                                } else {
                                  setStoreCategoryId("");
                                  setStoreCategoryName("");
                                }

                                setExpenseHeadName("");
                                setExpenseHeadId("");
                                setPolicy("");
                              }}
                            >
                              {el.storeName}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="dropdown-item text-muted">
                          No store found
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* ================= STORE INFO ================= */}
                {selectedStore && (
                  <div className="col-12">
                    <div className="card mt-2">
                      <div className="card-body p-3">
                        <div className="row">
                          <div className="col-6">
                            <b>State</b>
                            <div>{selectedStore?.stateId?.stateName}</div>
                          </div>
                          <div className="col-6">
                            <b>City</b>
                            <div>{selectedStore?.cityName}</div>
                          </div>
                          <div className="col-6 mt-2">
                            <b>Store Code</b>
                            <div>{selectedStore?.storeCode}</div>
                          </div>
                          <div className="col-6 mt-2">
                            <b>Zone</b>
                            <div>{selectedStore?.zoneId?.zoneName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STORE CATEGORY ================= */}
                <div className="col-12">
                  <label className="form-label">Store Category</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {storeCategoryName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {storeCategories.map((el) => (
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

                {/* ================= EXPENSE HEAD ================= */}
                <div className="col-12">
                  <label className="form-label">Expense Head</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {expenseHeadName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {expenseHeads.map((el) => (
                        <li key={el._id}>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => {
                              setExpenseHeadName(el.name);
                              setExpenseHeadId(el._id);
                            }}
                          >
                            {el.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= NATURE & AMOUNT ================= */}
                <div className="col-6">
                  <label className="form-label">Expense Value</label>
                  <input
                    type="number"
                    className="form-control"
                    value={expenseValue}
                    onChange={(e) => setExpenseValue(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Nature of Expense</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {natureOfExpense ? natureOfExpense : "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setNatureOfExpense("OPEX")}
                        >
                          OPEX
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setNatureOfExpense("CAPEX");
                          }}
                        >
                          CAPEX
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ================= REMARK & RCA ================= */}
                <div className="col-6">
                  <label className="form-label">Remark</label>
                  <textarea
                    className="form-control"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label">RCA</label>
                  <textarea
                    className="form-control"
                    value={rca}
                    onChange={(e) => setRca(e.target.value)}
                  />
                </div>

                {/* ================= POLICY ================= */}
                <div className="col-12">
                  <label className="form-label">Policy</label>
                  <div className="dropdown">
                    <button
                      className="form-control text-start dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {policy || "-- Select Policy --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("REPAIR & MAINTENANCE")}
                        >
                          REPAIR & MAINTENANCE
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("ADHOC MANPOWER")}
                        >
                          ADHOC MANPOWER
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("FIRE AMC")}
                        >
                          FIRE AMC
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("COLD ROOM R&M")}
                        >
                          COLD ROOM R&M
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ================= ATTACHMENT ================= */}
                {/* <div className="col-12">
                  <label className="form-label">Attachment</label>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="form-control"
                    onChange={(e) => setAttachment([...e.target.files])}
                  />
                </div> */}
                {/* ================= ATTACHMENT ================= */}
                <div className="col-12">
                  <label className="form-label">Attachments</label>

                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="form-control"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);

                      setAttachment((prev) => [...prev, ...files]);

                      // important: reset input so same file dubara select ho sake
                      e.target.value = null;
                    }}
                  />

                  {/* Selected Files Preview */}
                  {attachment.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">
                        {attachment.length} file(s) selected
                      </small>

                      <ul className="list-group mt-2">
                        {attachment.map((file, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {file.name}

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                const updated = attachment.filter((_, i) => i !== index);
                                setAttachment(updated);
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ================= TICKET ================= */}
                <div className="col-12">
                  <label className="form-label">Ticket ID</label>
                  <input
                    className="form-control"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn"
                    disabled={load}
                    style={{ background: "#6776f4", color: "white" }}
                  >
                    {load ? "Submitting..." : "Submit Expense"}
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
