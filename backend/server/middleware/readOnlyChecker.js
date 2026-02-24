module.exports = (req, res, next) => {
    const userType = req.decoded?.userType;

    // 11 is the Viewer userType
    if (userType === 11) {
        const writePatterns = [
            "/add",
            "/update",
            "/delete",
            "/del",
            "/changeStatus",
            "/approve",
            "/hold",
            "/reject",
            "/reSubmitHeldExpense",
            "/verifyAndCloseExpense",
            "/uploadWcrInvoice",
            "/prpoEmailAndClose",
            "/changePassword",
            "/changeDesignation"
        ];

        const isWriteOperation = writePatterns.some(pattern => req.path.includes(pattern));

        if (isWriteOperation) {
            return res.send({
                status: 403,
                success: false,
                message: "Permission Denied: Viewer cannot perform this action."
            });
        }
    }

    next();
};
