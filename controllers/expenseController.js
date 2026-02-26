const xlsx = require("xlsx");
const User = require("../models/User");
const Expense = require("../models/Expense");

//  Add Expense Source
const addExpense = async (req, res) => {
    const userId = req.user._id  // ✅ fixed: was req.user.id

    try {
        const { icon, cateory, amount, date } = req.body;  // ✅ fixed: removed source, added amount

        if (!cateory || !amount) {  // ✅ fixed: correct validation
            return res.status(400).json({ message: "All fields are required" })
        }

        const newExpense = new Expense({
            userId,
            icon,
            cateory,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

//  Get All Expense
const getAllExpense = async (req, res) => {
    const userId = req.user._id;  // ✅ fixed

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" })
    }
}

//  Delete Expense
const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}

const downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;  // ✅ fixed
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Icon: item.icon,
            Category: item.cateory,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel };