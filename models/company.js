var mongoose   = require("mongoose");

var companySchema = new mongoose.Schema({
    companyName: String,
    logo: String,
})





module.exports = mongoose.model("Company", companySchema);
