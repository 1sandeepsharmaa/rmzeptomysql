const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const filePath = path.join(__dirname, "../../exports/expenses.csv");

exports.saveToCSV = async (data) => {
  try {
    // Agar file exist karti hai to append mode
    const fileExists = fs.existsSync(filePath);

    const fields = ["name", "phone", "email", "amount", "date"];

    const parser = new Parser({ fields, header: !fileExists });
    const csv = parser.parse([{
      name: data.name,
      phone: data.phone,
      email: data.email,
      amount: data.amount,
      date: new Date().toLocaleString()
    }]);

    fs.appendFileSync(filePath, csv + "\n");

    return { success: true };

  } catch (err) {
    console.log("CSV Error:", err.message);
    return { success: false };
  }
};