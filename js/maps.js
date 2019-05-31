/*  Create map function: createMap() with geolocation
    Map and infoWindow is an object from Google Maps API! */
var map;

function createMap() {
    var options = {
        zoom: 15,
        center: { lat: 40.712776, lng: -74.005974 }
    };

    map = new google.maps.Map(document.getElementById('map'), options);

    var input = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);           // initialize the serch input from HTML file into a new variable

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];       // create and empty array

    // Add a listener for the places changed events on the searchbox
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();                       // storing the search city

        if (places.length == 0)
            return;

        markers.forEach(function (m) { m.setMap(null); });       // To clear old search
        markers = [];                                           // set array to empty again

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (p) {
            if (!p.geometry)
                return;

            markers.push(new google.maps.Marker({
                map: map,
                title: p.name,
                position: p.geometry.location
            }));

            if (p.geometry.viewport)
                bounds.union(p.geometry.viewport);
            else
                bounds.extend(p.geometry.location);
        });

        map.fitBounds(bounds);
    });
}
