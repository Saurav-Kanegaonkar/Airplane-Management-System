var mongoose   = require("mongoose");

var tripSchema = new mongoose.Schema({
    code: String,
    departure: String,
    destination: String,
    leavingDate: String,
    leavingTime: String,
    arrivalDate: String,
    arrivalTime: String,
    cost: {
        Economy: Number,
        Business: Number
    },
    ticketStatus:[
        {
            number: String,
            isTaken: Boolean
        }
    ],
    plane:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plane"
        },
        plane_id: String
    },
    company: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        logo: String
    }
});

module.exports = mongoose.model("Trip", tripSchema);
