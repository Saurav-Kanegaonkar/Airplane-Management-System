var mongoose   = require("mongoose");
var bcrypt     = require("bcryptjs")

var userSchema = new mongoose.Schema({
    username  : 
            {
                type: String,
                unique: true,
                required: true,
                trim: true
            },    
    password  : 
            {
                type: String,
                required: true,
            },    
    gender    : String,
    amount    : Number,
    email     : 
            {
                type: String,
                unique: true,
                required: true,
                trim: true
            },
    mobile    : String,
    ticketsPurchased : [
        {
          datePurchase: String,
          timePurchase: String,
          ticketInfo:{
              id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Ticket"
                  }, 
          },
          ticketNumber: String,
          departure: String,
          destination: String,
          leavingDate: String,
          arrivalDate: String,
          leavingTime: String,
          arrivalTime: String,
          companyName: String,
          Class: String,
          cost: String,
          ticketHolder: {
              fname: String,
              lname: String,
              age: String,
              gender: String
          }
      }
    ]
});

userSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

module.exports = mongoose.model("User", userSchema);
