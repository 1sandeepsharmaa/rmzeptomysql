const Expense = require("../Expense/expenseModel");
const User = require("../User/userModel");
const ExpenseHead = require("../ExpenseHead/expenseHeadModel");
const Store = require("../Store/storeModel");
const State = require("../State/stateModel");
const Zone = require("../Zone/zoneModel");
const StoreCategory = require("../Store Category/storeCategoryModel");
const ZonalHead = require("../Zonal Head/zonalHeadModel");
const ExpenseApproval = require("../Expense Approval/expenseApprovalModel");
const { Parser } = require("json2csv");
const { Op } = require("sequelize");

// Define Associations locally for deep includes
Expense.belongsTo(User, { foreignKey: 'raisedBy', as: 'user' });
Expense.belongsTo(ExpenseHead, { foreignKey: 'expenseHeadId', as: 'expenseHead' });
Expense.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Expense.hasMany(ExpenseApproval, { foreignKey: 'expenseId', as: 'approvals' });
Store.belongsTo(State, { foreignKey: 'stateId', as: 'state' });
Store.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });
Store.belongsTo(StoreCategory, { foreignKey: 'storeCategoryId', as: 'storeCategory' });

const exportExpenseCSV = async (req, res) => {
  console.log("EXPORT CSV HIT");

  try {
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'designation'] },
        { model: ExpenseHead, as: 'expenseHead', attributes: ['name'] },
        { model: ExpenseApproval, as: 'approvals' },
        {
          model: Store,
          as: 'store',
          attributes: ['storeName', 'storeCode', 'cityName'],
          include: [
            { model: State, as: 'state', attributes: ['stateName'] },
            { model: Zone, as: 'zone', attributes: ['zoneName'] },
            { model: StoreCategory, as: 'storeCategory', attributes: ['name'] }
          ]
        }
      ]
    });

    const [allUsers, allZonalHeads] = await Promise.all([
      User.findAll({ attributes: ['id', 'name', 'email', 'designation'] }),
      ZonalHead.findAll({ attributes: ['userId', 'name', 'email', 'zoneId', 'designation'] })
    ]);

    const formatted = expenses.map((e) => {
      const data = e.toJSON();
      const history = data.approvals || [];

      const getApproval = (level) => {
        const norm = (v) => v?.toUpperCase().replace(/[\s\/\_]+/g, "").trim();
        return history.find(h => norm(h.level) === norm(level)) || {};
      };

      const zh = getApproval("ZONALHEAD");
      const clm = getApproval("CLM");
      const biz = getApproval("BUSINESSFINANCE");
      const proc = getApproval("PROCUREMENT");
      const prpo = getApproval("PRPO");
      const zc = getApproval("ZONALCOMMERCIAL");
      const fm = getApproval("FM");

      // Resolve Pending With
      let pendingWithName = "";
      let pendingWithEmail = "";
      let pendingWithPos = data.currentApprovalLevel || "";

      if (data.currentStatus === "Pending" && data.currentApprovalLevel) {
        const levelNorm = data.currentApprovalLevel.toUpperCase().replace(/[\s\/\_]+/g, "");

        if (levelNorm === "ZONALHEAD") {
          const targetZH = allZonalHeads.find(z => z.zoneId === data.store?.zoneId);
          if (targetZH) {
            pendingWithName = targetZH.name;
            pendingWithEmail = targetZH.email;
          }
        } else if (levelNorm === "FM") {
          pendingWithName = data.user?.name || "";
          pendingWithEmail = data.user?.email || "";
        } else if (["CLM", "BUSINESSFINANCE", "PROCUREMENT", "PRPO", "ZONALCOMMERCIAL"].includes(levelNorm)) {
          const matches = allUsers.filter(u => u.designation?.toUpperCase().replace(/[\s\/\_]+/g, "") === levelNorm);
          pendingWithName = matches.map(m => m.name).join(" | ");
          pendingWithEmail = matches.map(m => m.email).join(" | ");
        }
      }

      // Resolve Hold Details
      let heldByName = "";
      let heldByEmail = "";
      let heldAtLevel = data.heldFromLevel || "";

      if (data.currentStatus === "Hold" && Array.isArray(data.holdHistory) && data.holdHistory.length > 0) {
        const lastHold = data.holdHistory[data.holdHistory.length - 1];
        const holder = allUsers.find(u => u.id === lastHold.heldBy);
        if (holder) {
          heldByName = holder.name;
          heldByEmail = holder.email;
        }
      }

      return {
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleString() : "",
        submitted_by: data.user?.name || "",
        submitted_by_email: data.user?.email || "",
        submitted_by_pos: data.user?.designation || "",
        pending_with_name: pendingWithName,
        pending_with_email: pendingWithEmail,
        pending_with_pos: pendingWithPos,
        state: data.store?.state?.stateName || "",
        city: data.store?.cityName || "",
        store_name: data.store?.storeName || "",
        store_code: data.store?.storeCode || "",
        zone: data.store?.zone?.zoneName || "",
        store_category: data.store?.storeCategory?.name || "",
        expense_head: data.expenseHead?.name || "",
        expense_type: data.natureOfExpense || "",
        expense_value: data.amount || "",
        remark: data.remark || "",
        rca: data.rca || "",
        policy: data.policy || "",
        approval_request: data.currentApprovalLevel || "",
        ticket_id: data.ticketId || "",
        attachment: Array.isArray(data.attachment)
          ? data.attachment.join(" | ")
          : data.attachment || "",
        status: data.currentStatus || "",
        hold_by: heldByName,
        hold_by_email: heldByEmail,
        hold_at_level: heldAtLevel,
        hold_remark: data.holdComment || "",
        zh_comment: zh.comment || "",
        zh_time: zh.actionAt ? new Date(zh.actionAt).toLocaleString() : "",
        clm_comment: clm.comment || "",
        clm_time: clm.actionAt ? new Date(clm.actionAt).toLocaleString() : "",
        biz_comment: biz.comment || "",
        biz_time: biz.actionAt ? new Date(biz.actionAt).toLocaleString() : "",
        proc_comment: proc.comment || "",
        proc_time: proc.actionAt ? new Date(proc.actionAt).toLocaleString() : "",
        prpo_comment: prpo.comment || "",
        prpo_time: prpo.actionAt ? new Date(prpo.actionAt).toLocaleString() : "",
        zc_comment: zc.comment || "",
        zc_time: zc.actionAt ? new Date(zc.actionAt).toLocaleString() : "",
        fm_comment: fm.comment || "",
        fm_time: fm.actionAt ? new Date(fm.actionAt).toLocaleString() : "",
        pr: data.prismId || "",
        po: "",
      };
    });

    const fields = Object.keys(formatted[0]);
    const parser = new Parser({ fields });
    const csv = "\ufeff" + parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment(`expense-report-${Date.now()}.csv`);
    return res.send(csv);

  } catch (err) {
    console.error("CSV ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { exportExpenseCSV };