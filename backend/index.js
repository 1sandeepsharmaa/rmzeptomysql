require("dotenv").config();
console.log("hello backend")
const express = require("express")
const app = express()
const port = 3000

const seeder = require("./server/config/seeder")

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '40mb' }))
app.use(require("./server/middleware/queryParser"))

app.use("/uploads", express.static("uploads"));
const multer = require("multer");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
});

const adminRoutes = require("./server/routes/adminRoutes")
app.use("/admin", adminRoutes)
const db = require("./server/config/db")

const apiRoutes = require("./server/routes/apiRoutes")
const { request } = require("express")
app.use("/apis", apiRoutes)

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

app.post('/', (req, res) => {
  res.send({
    status: 200,
    success: true,
    message: "Post request is hitted succesfully!!"
  });
});

db.syncDatabase()
  .then(() => {
    seeder.adminReg();
    app.listen(port, (err) => {
      if (err) {
        console.log("server is not connected!!")
      }
      else {
        console.log("server is running on port", port)
      }
    })
  })
  .catch(err => {
    console.error("Failed to initialize system:", err);
  });
