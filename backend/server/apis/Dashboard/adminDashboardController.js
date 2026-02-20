const expenseModel = require("../Expense/expenseModel");
const userModel = require("../User/userModel");
const { Op } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    /* =========================
       🔹 DATE CALCULATIONS
    ========================= */
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    /* =========================
       🔹 EXPENSE STATS
    ========================= */
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      declinedRequests,
      inProcessRequests,
      todayRequests,
      missingBridgeRequests
    ] = await Promise.all([
      expenseModel.count(),

      expenseModel.count({ where: { currentStatus: "Pending" } }),

      expenseModel.count({ where: { currentStatus: "Approved" } }),

      expenseModel.count({ where: { currentStatus: "Declined" } }),

      expenseModel.count({ where: { currentStatus: "Hold" } }),

      expenseModel.count({
        where: { createdAt: { [Op.gte]: todayStart } }
      }),

      expenseModel.count({
        where: {
          currentStatus: "Pending",
          createdAt: { [Op.lte]: threeDaysAgo }
        }
      })
    ]);

    /* =========================
       🔹 USER / DESIGNATION STATS
    ========================= */
    const [
      totalUsers,
      totalFacilityManagers,
      totalCLMs,
      totalZonalHeads,
      totalBusinessFinance,
      totalProcurement,
      totalPrPo,
      totalZonalCommercial,
      totalMissingBridgeUsers
    ] = await Promise.all([
      userModel.count({ where: { status: true } }),

      userModel.count({ where: { designation: "FM", status: true } }),
      userModel.count({ where: { designation: "CLM", status: true } }),
      userModel.count({ where: { designation: "Zonal_Head", status: true } }),

      userModel.count({ where: { designation: "Business_Finance", status: true } }),
      userModel.count({ where: { designation: "Procurement", status: true } }),
      userModel.count({ where: { designation: "PR/PO", status: true } }),
      userModel.count({ where: { designation: "Zonal_Commercial", status: true } }),
      userModel.count({ where: { designation: "Missing_Bridge", status: true } })
    ]);

    res.status(200).send({
      success: true,
      message: "Admin Dashboard",
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests: declinedRequests, // frontend expects rejectedRequests
        inProcessRequests,
        todayRequests,
        missingBridgeRequests,

        totalUsers,
        totalFacilityManagers,
        totalCLMs,
        totalZonalHeads,
        totalBusinessFinance,
        totalProcurement,
        totalPrPo,
        totalZonalCommercial,
        totalMissingBridgeUsers
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send({
      success: false,
      message: "Dashboard Error"
    });
  }
};

module.exports = { getDashboard };
