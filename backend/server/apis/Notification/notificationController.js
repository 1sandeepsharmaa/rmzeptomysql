const notificationModel = require("./notificationModel");

const sendNotification = async (
    userId,
    title,
    message,
    expenseId = null
) => {
    try {
        await notificationModel.create({
            userId: userId,
            title: title,
            message: message,
            expenseId: expenseId,
        });
    } catch (error) {
        console.error("Notification Error:", error.message);
    }
};

module.exports = { sendNotification };