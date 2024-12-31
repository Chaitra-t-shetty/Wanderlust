const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const { reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in make changes to listing");
        //return ensures that no further thing is executed.
        //multiple responses can create an error.
        return res.redirect("/login");
    }
    next();
};

//in passport , after login the session restarts and redirecturl becomes undefined
//therefore , locals have to be created for it.
//passports can never delete locals

module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; 
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {_id} = req.params;
    let listing = await Listing.findById(_id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of listing");
        return res.redirect(`/listings/${_id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};