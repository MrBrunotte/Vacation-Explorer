var request;                    // moved the variables so that they have Global scope (local scope inside the functions)
var service;                    // Global scope means that they are can be accessed in the whole program!
var markers = [];
var map;
var infoWindow;                 // adds information to each marker when clicked

function initMap() {
    var center = new google.maps.LatLng(40.712776, -74.005974);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
    });

    // Modification of the initMap function (request, service and nearbySearch)
    request = {                             //Create a variable called request so that Google can find what we are looking for.
        location: center,
        radius: 1000,                       // 2000 meters from center of map
        types: ['restaurant', 'bakery', 'bar', 'cafe']
    };

    infoWindow = new google.maps.InfoWindow();                  //The googole maps InfoWindow function (InfoWindow is a constrfuctor!)

    service = new google.maps.places.PlacesService(map);        // this object searches for our cafes and it is a function from google

    service.nearbySearch(request, callback);                    // we use the nearbySearch function for the request and we use the callback method to check that everything runs ok.

    google.maps.event.addListener(map, 'rightclick', function (event) {     // added a listener for RightClicks and create a new search for cafes around that location.
        map.setCenter(event.latLng)
        clearResults(markers)                                   //Centers the map to the right-click position

        var request = {
            location: event.latLng,                             // the center is now centered aroung the "rightclick"
            radius: 1000,                                       // the radius is 2000 meters from the click
            //iconImage: 'http://maps.google.com/mapfiles/kml/pal2/icon55.png',     //fork and knife image
            types: ['restaurant']
        };
        service.nearbySearch(request, callback);                // the nearbySearch functions request and makes the callback like the first time
    })
}

// create the callback function which is called from the service object: service.nearbySearch
// The function checks that everything is ok and adds all the results in the results variable
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));
        }
    }
}

// create the createMarker function that creates and place the markers on the map based on the results from the createMarker function
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        iconImage: 'http://maps.google.com/mapfiles/kml/pal2/icon55.png',     //Coffee mug
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function () { //This listener listens for "clicks" on the map

        infoWindow.setContent(place.name);      // gets the name of the location of the clicked marker
        infoWindow.open(map, this);             // opens the info on the marker that is clicked ("this" one)
    });
    return marker;                              // returns the markers 
}

function clearResults(markers) {                // This function clears all the markers when the user "rightClicks"
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = []                                // sets the marker array to empty everytime the user "rightClicks"
}
//google.maps.event.addDomListener(window, 'load', initMap); //Dont need this line since I already have the script src in the index file!
