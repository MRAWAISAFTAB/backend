const xlsx = require("xlsx");
const User = require("../models/User");
const Income = require("../models/Income");

//  Add income Source
const addIncome = async (req, res) => {
    const userId = req.user._id

    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

//  Get All income Source
const getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income)
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}

//  Delete income Source
const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}

const downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Icon: item.icon,
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // ✅ Buffer use karo — Vercel pe file system nahi hota
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=income.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };