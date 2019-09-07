/* Add all the required libraries*/
var ListingSchema = require('./ListingSchema'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema, 
    config = require('./config');

/* Connect to your database using mongoose - remember to keep your key secret*/
mongoose.connect(config.db.uri, { useNewUrlParser: true });

/* Fill out these functions using Mongoose queries*/
//Check out - https://mongoosejs.com/docs/queries.html

var Listings = mongoose.model('Listing', ListingSchema.listingSchema);

var findLibraryWest = function() {
  /* 
    Find the document that contains data corresponding to Library West,
    then log it to the console. 
   */
  Listings.findOne({ 'name': 'Library West' }, function(err, listing) {
    if (!err) console.log(listing);
  });
};

var removeCable = function() {
  /*
    Find the document with the code 'CABL'. This cooresponds with courses that can only be viewed 
    on cable TV. Since we live in the 21st century and most courses are now web based, go ahead
    and remove this listing from your database and log the document to the console. 
   */

  var listingCode = 'CABL';

  Listings.findOneAndRemove({ 'code': listingCode }, function(err, listing) {
    if(listing != null) {
      console.log(listing);
    } 
    else console.log('Listing not found: %s', listingCode);
  });
};

var updatePhelpsMemorial = function() {
  /*
    Phelps Memorial Hospital Center's address is incorrect. Find the listing, update it, and then 
    log the updated document to the console. 
   */

  var listingName = 'Phelps Memorial Hospital Center';

  Listings.findOne({ 'name': listingName }, function(err, listing) {
    if (listing != null) {
      listing.address = '701 N Broadway, Sleepy Hollow, NY 10591, United States';

      listing.save(function(err) {
        if (err) console.log(err);
      });

      console.log(listing);
    }
    else console.log('Listing not found: %s', listingName);
  });
};

var retrieveAllListings = function() {
  Listings.find({ }, function(err, results) {
    if (results != null) console.log(results);
    else if (err) console.log(err);
    else console.log('No listings found.');
  });
};

var RefreshDatabase = function() {
  var JsonToMongo = require('./JSONtoMongo');
  Listings.deleteMany({ }, function (err) { JsonToMongo.populate });
}

// Uncomment to wipe database
//RefreshDatabase();/*
findLibraryWest();
removeCable();
updatePhelpsMemorial();
retrieveAllListings();
//*/