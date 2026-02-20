const mongoose = require("mongoose")

const announcementSchemna = new mongoose.Schema({
    title: { type: String, default: "Null" },
    message: { type: String, default: "Null" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "userData" },
    attachment: { type: String, default: "No File Found" },
    updatedAt: { type: Date },
    status: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = new mongoose.model("announcementData", announcementSchemna)