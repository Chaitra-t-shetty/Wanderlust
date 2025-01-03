const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner , validateListing } =require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My new villa",
//         description : "By the beach",
//         price : 1200 ,
//         location : "Calangute,Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull");
// });



//index route
//create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
    

//new route
router.get('/new',isLoggedIn,listingController.renderNewForm );


//show route
//update route
//delete route
router.route("/:_id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updatelisting))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit route
router.get('/:_id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;