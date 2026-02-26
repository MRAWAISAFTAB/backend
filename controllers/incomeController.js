const xlsx = require("xlsx"); // make sure this is imported at the top
const User = require("../models/User");
const Income = require("../models/Income");

//  Add income Source
const addIncome = async (req, res) => {
    const userId = req.user.id

    try {
        const { icon, source, amount, date } = req.body;

        // Validation check for missin field
        if (!source || !icon || !amount) {
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
        res.status(500).json({ message: "Server Error lala" });
    }
}
//  Get All income Source
const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income)
    } catch (err) {
        res.status(500).json({ messae: "Server Error" })
    }
}

//  Delete income Source
const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income Deleted Sucess" })
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}


const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };