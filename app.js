var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	flash          = require("connect-flash"),
	mongoose       = require("mongoose"),
	request        = require("request"),
	bcrypt         = require("bcryptjs")
	methodOverride = require("method-override"),
	User           = require("./models/user"),
	Passenger      = require("./models/passenger"), 
	Ticket         = require("./models/ticket"),
	Plane          = require("./models/plane"),
	Trip           = require("./models/trip"),
	util           = require("util"), 
	Company        = require("./models/company");

// passport       = require("passport"),
// googleAuth     = require("passport-google-oauth"),
// LocalStrategy  = require("passport-local"),

mongoose.connect("mongodb://localhost/airplane", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "I'm lelouch",
	resave: false,
	saveUninitialized: false
}));

app.use(function(req, res, next){
	res.locals.currentUser = req.session.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// ====================
// Local-passport
// ====================


// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// ====================
// Google-passport
// ====================


// passport.use(new googleStrategy({
//     callbackURL: "/google/redirect",
//     clientID: "925855994886-k1nvie0jpjv8ldec4cu3gknh4c61lph9.apps.googleusercontent.com",
//     clientSecret: "0yDnywz2Jza3B6CH8ppXa7y_"
// }, function(accessToken, refreshToken, profile, done){

//     User.findOne({googleID: profile.id}).then((currentUser) => {
//         if(currentUser){
//             console.log("user is: ", currentUser);
//         }
//         else{
//             new User({
//                 username: profile.displayName,
//                 googleID: profile.id
//                 }).save().then((newUser) => {
//                 console.log("new user created " + newUser)
//             }) 
//         }
//     })
	
// })
// )

// ====================
// Google_routes
// ====================

// app.get("/google", passport.authenticate("google", {
//     scope:['profile']
// }));

// app.get("/google/redirect",passport.authenticate("google"), function(req,res){
	
// });


// =========================
// LANDING PAGE
// =========================

app.get("/", function(req,res){
	Company.find(function(err, foundcomp){
		if(err){
			console.log(err);
		}
		else{
			res.render("landing", {foundcomp: foundcomp})
		}
	})
});

app.get("/landing", function(req,res){
	Company.find(function(err, foundcomp){
		if(err){
			console.log(err);
		}
		else{
			res.render("landing", {foundcomp: foundcomp})
		}
	})
});

app.post("/landing", function(req,res){
	if(req.body.trip == "oneWay"){
		if(req.body.departure && req.body.destination && req.body.leavingDate){
			if(req.body.departure != req.body.destination){
				Trip.find({departure: req.body.departure , destination: req.body.destination, leavingDate: req.body.leavingDate}, function(err, foundtrips){
					if(err){
						console.log(err);
					}
					else{
						
						res.render("results", {foundtrips: foundtrips});
					}
				});
			}
			else{
				req.flash("error", "Departure and Destination can not be same");
				res.redirect("/landing");
			}
		}
		else{
			req.flash("error", "Please fill out the form properly");
			res.redirect("/landing");
		}
	}
	else{
		res.render("results");
	}
});

app.get("/results", function(req,res){
	res.render("results");
});

// =========================
// Login, Register, Logout
// =========================

app.get("/register", function(req,res){
	res.render("register");

});

app.post("/register", function(req,res){
	if(req.body.fName && req.body.lName && req.body.phone && req.body.email && req.body.gender && req.body.password)
	{
		if(hasLowerCase(req.body.password))
		{
			if(hasUpperCase(req.body.password))
			{
				if(hasNumber(req.body.password))
				{
					if(req.body.password.length>7)
					{
						if(onlyNumber(req.body.phone) && req.body.phone>9)
						{
							var username = req.body.fName + " "  + req.body.lName;
							var newUser = {username: username, mobile:req.body.phone, email: req.body.email, gender:req.body.gender, password: req.body.password};
							User.create(newUser, function(err, user){
								if(err){
									console.log(err.message);
									return res.render("register");
								}
								else{
										req.flash("success", "Registered Successfully");  
										res.redirect("/login");   
								}
							});
						}
						else
						{
							req.flash("error", "Invalid mobile number");
							res.redirect("/register");
						}
					}   
					else
					{
						req.flash("error", "Your password should contain minimum 8 characters");
						res.redirect("/register");
					}
				}
				else
				{
					// flash message telling you dont have number
					req.flash("error", "Your password doesn't contain number");
					res.redirect("/register");
				}
			}
			else
			{
				// flash message telling you dont have uppercase
				req.flash("error", "Your password coesn't contain uppercase");
				res.redirect("/register");
			}
		}
		else
		{
			// flash message telling you dont have lowercase
			req.flash("error", "Your password doesn't contain lowercase");
			res.redirect("/register");
		}
		
	}
	else{
		// flash message telling you have missed something
		req.flash("error", "Please fill out the form completely");
		res.redirect("/register");
	}

});


app.get("/login", function(req,res){
	res.render("login");
});


app.post("/login", function(req,res){
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, user) {
		  if (error || !user) {
			req.flash("error", "Incorrect Password or EmailID");
			res.redirect("/login");
		  } 
		  else {
			req.session.user = user;
			req.flash("success", "Logged In Successfully " + user.username);
			return res.redirect('/landing');
		  }
		});
	  } 
	  else {
		req.flash("error", "Please fill out the form completely");
		res.redirect("/login");
	  }
});


app.get("/logout", function(req, res){
	if (req.session) {
		// delete session object
		req.session.destroy(function(err) {
		  if(err) {
			console.log(err);
		  } 
		  else {
			return res.redirect('/landing');
		  }
		});
	  }
});

// =====================================
// Create  Data for Companies For Admin
// =====================================

app.get("/Companies", function(req,res){
	Company.find({}, function(err, comp){
		if(err){
			console.log(err);
		}
		else{
			res.render("companies", {comp:comp});
		}
	});
});

app.get("/Companies/createCompany", isLoggedIn, function(req,res){
	res.render("createCompany");
});

app.post("/Companies/createCompany", isLoggedIn, function(req,res){
	if(req.body.name && req.body.logo)
	{
		var companyName = req.body.name;
		var logo = req.body.logo;
		var newComp = {companyName:companyName, logo: logo}
		Company.create(newComp, function(err, newComp){
			if(err){
				console.log(err);
			}
			else{
				req.flash("success", "Company created");
				res.redirect("/Companies");
			}
		});
	}
	else{
		req.flash("error","Please Fill Out The Form");
		res.redirect("/Companies/createCompany");
	}
});

app.get("/Companies/:id", function(req,res){

	Company.findById(req.params.id, function(err,company){
		if(err)
		{
			console.log(err);
		}
		else{
			Plane.find({"company.id": req.params.id}, function(err,plane){
				if(err){
					console.log(err);
				}
				else{
					res.render("companyDetail", {plane:plane, comp:company});
				}
			});
		}
	});
	
});

app.get("/Companies/:id/createAirplane", isLoggedIn, function(req,res){
	Company.findById(req.params.id, function(err,company){
		if(err)
		{
			console.log(err);
		}
		else{
			res.render("createAirplane",{comp:company});
		}
	});
});

app.post("/Companies/:id/createAirplane", isLoggedIn, function(req,res){
	if(req.body.plane_id && req.body.ticketBusiness && req.body.ticketEconomy)
	{
		Company.findById(req.params.id, function(err,company){
			if(err)
			{
				console.log(err);
			}
			else{
				var company = {id: req.params.id, companyName: company.companyName}
				var newPlane = {plane_id: req.body.plane_id , ticketBusiness: req.body.ticketBusiness, ticketEconomy: req.body.ticketEconomy , company:company};
				Plane.create(newPlane, function(err, newplane){
					if(err){
						console.log(err);
					}
					else{
						req.flash("success", "Airplane added for company " + company.companyName);
						res.redirect("/Companies/" + req.params.id);
					}
				});
			}
		});
	}
	else{
		req.flash("error","Please Fill Out The Form");
		res.redirect("/Companies/" + req.params.id + "/createAirplane");
	}
});

app.get("/Companies/:id/:plane_id", function(req,res){
	Company.findById(req.params.id, function(err, comp){
		if(err){
			console.log(err);
		}
		else{
			Plane.findById(req.params.plane_id, function(err, foundplane){
				if(err){
					console.log(err);
				}
				else{
					Trip.find({"plane.plane_id": foundplane.plane_id}, function(err,foundtrip){
						if(err){
							console.log(err);
						}
						else{
							res.render("planeDetail", {plane: foundplane, comp:comp, trip: foundtrip});
						}
					});
				}
			});
		}
	});
});

app.get("/Companies/:id/:plane_id/createTrip", isLoggedIn, function(req,res){
	Plane.findById(req.params.plane_id, function(err,plane){
		if(err){
			console.log(err);
		}
		else{
			res.render("createTrip", {plane:plane, comp_id: req.params.id});
		}
	});
});

app.post("/Companies/:id/:plane_id/createTrip", isLoggedIn, function(req,res){
	if(req.body.departure && req.body.destination && req.body.leavingDate && req.body.arrivalDate && req.body.Economy && req.body.Business && req.body.arrivalTime && req.body.leavingTime){
		if(req.body.departure != req.body.destination){
			Company.findById(req.params.id, function(err, foundcomp){
				if(err){
					console.log(err);
				}
				else{
					Plane.findById(req.params.plane_id, function(err, foundplane){
						if(err){
							console.log(err);
						}
						else{
							var plane_code = foundplane.plane_id;
							var cost = {Economy: req.body.Economy, Business: req.body.Business};
							var company = {id: req.params.id, logo: foundcomp.logo};
							var plane = {id: req.params.plane_id, plane_id: plane_code};
							var code = (req.body.departure[0]+req.body.departure[1]+req.body.departure[2]).toUpperCase() + "to" + (req.body.destination[0]+req.body.destination[1]+req.body.destination[2]).toUpperCase()
							var newTrip = {departure: req.body.departure, destination: req.body.destination, leavingDate: req.body.leavingDate, arrivalDate: req.body.arrivalDate, cost: cost, code:code, plane: plane, company:company, leavingTime: req.body.leavingTime, arrivalTime: req.body.arrivalTime};
							Trip.create(newTrip, function(err, trip){
								if(err){
									console.log(err);
								}
								else{
									Plane.findById(req.params.plane_id, function(err, plane){
										if(err){
											console.log(err);
										}
										else{
											req.flash("success", "Successfully added Trip");
											res.redirect("/Companies/" + req.params.id + "/" + req.params.plane_id)
										}
									});
								}
							});
						}
					});
				}
			});
		}
		else{
			req.flash("error", "Departure and Destination cannot be same");
			res.redirect("/Companies/" + req.params.id + "/" + req.params.plane_id + "/createTrip");
		}
		
	}   
	else{
		req.flash("error","Please Fill Out The Form");
		res.redirect("/Companies/" + req.params.id + "/" + req.params.plane_id);
	}
});

// =========================
// Display for users
// =========================


app.get("/profile", isLoggedIn, function(req,res){
	res.render("profile");
});

app.get("/profile/edit", isLoggedIn, function(req,res){
	res.render("editProfile");
});

app.put("/profile/edit", function(req,res){
	if(req.body.fName && req.body.lName && req.body.phone && req.body.email && req.body.gender){
		if(onlyNumber(req.body.phone) && req.body.phone.length>9)
			{
				var username = req.body.fName + " "  + req.body.lName;
				var newUser = {username: username, mobile:req.body.phone, email: req.body.email, gender:req.body.gender};
				User.findByIdAndUpdate(req.session.user._id, newUser, {new: true}, function(err, updateUser){
					if(err){
						console.log(err);
					}
					else{
						req.session.user = updateUser;
						req.flash("success", "User Profile Updated!!");
						res.redirect("/profile");
					}
				});
			}   
			else
			{
				req.flash("error", "Invalid mobile number");
				res.redirect("/profile/edit");
			}
	}
	else{
		req.flash("error", "Please fill out the form");
		res.redirect("/profile/edit");
	}
});

app.get("/:Company", function(req,res){
	Company.find({companyName: req.params.Company},function(err, foundcomp){
		if(err){
			console.log(err);
		}
		else{
			if(foundcomp.length == 0){
				res.redirect("/landing");
			}
			else{
				console.log(foundcomp)
				Trip.find({"company.id": foundcomp[0].id},function(err, foundtrip){
					if(err){
						console.log(err);
					}
					else{
						res.render("Company", {foundtrip: foundtrip, compName: foundcomp[0].companyName});
					}
				});
			}
		}
	});
});

// =========================
// Middlewares
// =========================

function hasLowerCase(str) {
	return str.toUpperCase() != str;
}

function hasUpperCase(str) {
	return str.toLowerCase() != str;
}

function hasNumber(myString) {
	return /\d/.test(myString);
}

function onlyNumber(str){
	return /^\d+$/.test(str);
}

function isLoggedIn(req, res, next) {
	if (req.session && req.session.user) {
	  return next();
	} else {
		req.flash("error", "Login is required");
		res.redirect("/login");
	}
  }

// =========================
// App running
// =========================
app.listen(4000, function(){
	console.log("App running on port 4000");
});

