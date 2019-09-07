/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;
    
/* Create your schema for the data in the listings.json file that will define how data is saved in your database
     See https://mongoosejs.com/docs/guide.html for examples for creating schemas
     See also https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
  */
var listingSchema = new Schema({
  code: String,
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: String
});

/* Create a 'pre' function that adds the updated_at 
(and created_at if not already there) property */
listingSchema.pre('save', function(next) {

    var now = new Date();

    this.updated_at = now;
  
    if (!this.created_at)
      this.created_at = now;

    if (!this.code)
      throw new error('Code not provided.');
    if (!this.name)
      throw new error('Name not provided.');
      
    next();
});

/* Use schema to instantiate a Mongoose model */
//Check out - https://mongoosejs.com/docs/guide.html#models
var Listing = mongoose.model('Listing', listingSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Listing;
