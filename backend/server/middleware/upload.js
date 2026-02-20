const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔹 Ensure folder exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// 🔹 Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        let uploadPath = "uploads/";

        if (file.fieldname === "attachment") {
            uploadPath = "uploads/original";
        }
        else if (file.fieldname === "prAttachment") {
            uploadPath = "uploads/pr";
        }
        else if (file.fieldname === "poAttachment") {
            uploadPath = "uploads/po";
        }
        else if (file.fieldname === "wcrAttachment") {
            uploadPath = "uploads/wcr";
        }
        else if (file.fieldname === "invoiceAttachment") {
            uploadPath = "uploads/invoice";
        }
        else if (file.fieldname === "resubmittedAttachment") {
            uploadPath = "uploads/resubmit";
        }

        ensureDir(uploadPath);
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "_" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// 🔹 Allowed File Types
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|gif|webp|bmp|svg|pdf|xls|xlsx|csv|doc|docx/;

    const extName = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
    );

    const allowedMimeTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/svg+xml",

        // PDF
        "application/pdf",

        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",

        // Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const mimeTypeValid = allowedMimeTypes.includes(file.mimetype);

    if (extName && mimeTypeValid) {
        cb(null, true);
    } else {
        cb(new Error("Only Image, PDF, Excel, and Word files are allowed"));
    }
};

// 🔹 Multer configuration
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter,
});

module.exports = upload;
