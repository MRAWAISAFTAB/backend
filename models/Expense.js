const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    // this is to store the id in a special type called objectId
    userId : { type : mongoose.Types.ObjectId, ref : "User", required : true},
    icon : {type : String},
    cateory : {type : String, required : true},
    amount : {type : String , required : true},
    date : {type : Date, default : Date.now},
},{timestamps : true});

module.exports = mongoose.model("Expense" , ExpenseSchema)
