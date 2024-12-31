if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require('express')
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
    .then(()=>{
    console.log("Connected to db");
    })
    .catch((err) =>{
    console.log(err);
}); 
async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(dbUrl);
}

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600
})

const sessionOptions ={
    store : store ,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser" , async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let newUser =await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


app.all("*" , (req,res,next)=>{
    next(new ExpressError( 404,"Page not found!"));
});
//midlleware for error handling
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs" , {err});
});

app.listen(port,(req,res)=>{
    console.log("listening on port",8080);
});