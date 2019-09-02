var http = require('http'), 
    fs = require('fs'), 
    url = require('url'),
    port = 8080;

/* Global variables */
var listingData, server;
var initializationError = false;

/* Return URL to google maps */
var getGoogleMapsUrl = function(listingElement) {
  var mapsUrl = 'https://www.google.com/maps/';

  if (listingElement.coordinates != undefined)
    mapsUrl += 'search/?api=1&query='
             + listingElement.coordinates.latitude + ',' 
             + listingElement.coordinates.longitude;

  return mapsUrl;
}

/* Wrap an attribute in an HTML tag */
var tagListingAttribute = function(attribute, tag) {
  if (attribute != undefined)
    return '<' + tag + '>' + attribute + '</' + tag + '>';
  else 
    return '';
}

/* Style a listing.json string with HTML and CSS */
var beautify = function(listingText) {
  var rtnString = '';
  var json = JSON.parse(listingText);

  rtnString += '<div><style type=\'text/css\' scoped>'
              + '.listingItem {'
                + 'border: solid #bc581a 5px;'
                + 'border-radius: 10%;'
                + 'display: inline-block;'
                + 'text-align: center;'
                + 'margin: 15px;'
                + 'padding: 10px;'
                + 'width: 215px;'
                + 'height: 215px;'
                + 'vertical-align: middle;'
                + 'background-color: #00529b;'
                + 'font-family: "gentona", "Georgia", serif;'
                + '} '
              + 'a {'
                + 'text-decoration: none;'
                + 'color: #fff;'
                + '} '
              + 'a div:hover {'
                + 'background-color: #fff;'
                + 'color: #bc581a;'
                + 'border: solid #00529b 5px;'
                + '}</style>';

  for (el in json.entries) {
    rtnString += '<a target=\'_blank\' href=\'' + getGoogleMapsUrl(json.entries[el]) + '\'>'
              + '<div class=\'listingItem\'>'
                + tagListingAttribute(json.entries[el].code, 'h2')
                + tagListingAttribute(json.entries[el].name, 'h3')
                + tagListingAttribute(json.entries[el].address, 'h4')
              + '</div></a>';
  }

  rtnString += '</div>';

  return rtnString;
}

/* Called when a user enters the host URL */
var requestHandler = function(request, response) {
  var parsedUrl = url.parse(request.url);
 
  // if host/listings
  if (parsedUrl.path == '/listings')
    if (!initializationError) response.end(listingData);
    else response.end('Server Error - Could not read listings');

  // if host/listings-beautiful
  else if (parsedUrl.path == '/listings-beautiful')
    if (!initializationError) response.end(beautify(listingData));
    else response.end('Server Error - Could not read listings');

  // If bad path is passed
  else {  
    response.writeHead(404);
    response.end('Bad gateway error');
  }
};

/* Initialize listingData and Start the server */
fs.readFile('listings.json', 'utf8', function(err, data) {
  
  if (!err)
    listingData = data;
  else 
    initializationError = true;

  server = http.createServer(requestHandler);
  
  server.listen(port, function() {
    console.log('server listening on: http://localhost:' + port);
  });

});