var mongoose   = require("mongoose");

var planeSchema = new mongoose.Schema({
    plane_id: String,
    ticketEconomy: Number,
    ticketBusiness: Number,
    company:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        companyName: String
    }
});





module.exports = mongoose.model("Plane", planeSchema);
