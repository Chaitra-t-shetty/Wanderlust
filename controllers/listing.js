const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {_id} = req.params;
    const mylist = await Listing.findById(_id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!mylist){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(mylist);
    res.render("./listings/show.ejs" , {mylist});
};

module.exports.createListing = async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    //     let sampleListing = new Listing({
    //     title : title,
    //     description : description,
    //     image : image ,
    //     price : price ,
    //     location : location,
    //     country: country,
    // });
    // await sampleListing.save();
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , ".." , filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect('/listings');  
};

module.exports.renderEditForm = async (req,res)=>{
    let {_id} = req.params;
    const mylist = await Listing.findById(_id);
    if(!mylist){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = mylist.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs" , {mylist , originalImageUrl});
};

module.exports.updatelisting = async (req,res)=>{
    let {_id} = req.params;
    // let {title : newtitle ,description:newdescription,image:newimage,price:newprice,location:newlocation,country:newcountry} = req.body;
    // let upList = await Listing.findByIdAndUpdate(_id ,{title : newtitle ,description:newdescription,image:newimage,price:newprice,location:newlocation,country:newcountry},{runValidators:true , new:true});
    let listing = await Listing.findByIdAndUpdate(_id,{...req.body.listing});

    if(typeof req.file !="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","listing updated");
    res.redirect(`/listings/${_id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {_id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(_id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
};