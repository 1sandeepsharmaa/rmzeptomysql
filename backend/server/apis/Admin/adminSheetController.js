const Expense = require("../Expense/expenseModel");
const User = require("../User/userModel");
const ExpenseHead = require("../ExpenseHead/expenseHeadModel");
const Store = require("../Store/storeModel");
const State = require("../State/stateModel");
const Zone = require("../Zone/zoneModel");
const StoreCategory = require("../Store Category/storeCategoryModel");
const { Parser } = require("json2csv");
const { Op } = require("sequelize");

// Define Associations locally for deep includes
Expense.belongsTo(User, { foreignKey: 'raisedBy', as: 'user' });
Expense.belongsTo(ExpenseHead, { foreignKey: 'expenseHeadId', as: 'expenseHead' });
Expense.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.belongsTo(State, { foreignKey: 'stateId', as: 'state' });
Store.belongsTo(Zone, { foreignKey: 'zoneId', as: 'zone' });
Store.belongsTo(StoreCategory, { foreignKey: 'storeCategoryId', as: 'storeCategory' });

const exportExpenseCSV = async (req, res) => {
  console.log("EXPORT CSV HIT");

  try {
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name'] },
        { model: ExpenseHead, as: 'expenseHead', attributes: ['name'] },
        {
          model: Store,
          as: 'store',
          attributes: ['storeName', 'storeCode', 'cityName'],
          include: [
            { model: State, as: 'state', attributes: ['stateName'] },
            { model: Zone, as: 'zone', attributes: ['zoneName'] },
            { model: StoreCategory, as: 'storeCategory', attributes: ['categoryName'] }
          ]
        }
      ]
    });

    if (!expenses || expenses.length === 0) {
      return res.status(200).send("No expense data found");
    }

    const formatted = expenses.map((e) => {
      const data = e.toJSON();
      return {
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleString() : "",
        submitted_by: data.user?.name || "",
        state: data.store?.state?.stateName || "",
        city: data.store?.cityName || "",
        store_name: data.store?.storeName || "",
        store_code: data.store?.storeCode || "",
        zone: data.store?.zone?.zoneName || "",
        store_category: data.store?.storeCategory?.categoryName || "",
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
        hold_remark: data.holdComment || "",
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