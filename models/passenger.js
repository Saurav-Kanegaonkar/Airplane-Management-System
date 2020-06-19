var mongoose   = require("mongoose");


var passengerSchema = new mongoose.Schema({
    fullName: String,
    gender: String,
    age: {
        type: Number, 
        min: 4, 
        max: 80 
    },
});


module.exports = mongoose.model("Passenger", passengerSchema);
