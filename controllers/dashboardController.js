const Income = require("../models/Income");
const Expense = require("../models/Expense");

const getDashboardData = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    // Totals
    // const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    // const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    // Last 60 days transactions combined
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentTransactions = [
      ...incomes
        .filter((i) => new Date(i.date) >= sixtyDaysAgo)
        .map((i) => ({ ...i.toObject(), type: "income" })),
      ...expenses
        .filter((e) => new Date(e.date) >= sixtyDaysAgo)
        .map((e) => ({ ...e.toObject(), type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Monthly breakdown for last 6 months
    const monthlyData = getLast6MonthsData(incomes, expenses);

    res.status(200).json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions,
      monthlyData,
      incomeCount: incomes.length,
      expenseCount: expenses.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLast6MonthsData = (incomes, expenses) => {
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" });
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthlyIncome = incomes
      .filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const monthlyExpense = expenses
      .filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    months.push({ month: monthLabel, income: monthlyIncome, expense: monthlyExpense });
  }

  return months;
};

module.exports = { getDashboardData };