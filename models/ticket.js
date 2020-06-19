var mongoose   = require("mongoose");

var ticketSchema = new mongoose.Schema({
    ticketNumber: String,
    class: String,
    cost: Number,
    departure: String,
    destination: String,
    leavingDate: Date,
    arrivalDate: Date,
    anyHolder: Boolean,
    ticketHolder: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Passenger"
        },
        username: String
    },
    flight: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plane"
        },
        plane_id : String
    },
    company: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        companyName: String
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);
