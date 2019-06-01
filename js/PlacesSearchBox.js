function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.712776, lng: -74.005974 },
        radius: '3000',
        zoom: 15
        //zoom: 3,
        //mapTypeId: 'satellite'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search');               /* Grab the reference to the searchbox!*/
    var searchBox = new google.maps.places.SearchBox(input);        /* We initialize the searchBox and passing in the input from the box*/

    var markers = [];           /* Create an array so that we can see the markers on the map*/


    searchBox.addListener('places_changed', function () {           // Listen for the event fired when the user search for a city and retrieve                                                                    more details for that place.
        var places = searchBox.getPlaces();                         // store the searches in the variable "places"

        if (places.length == 0) {                                   // if no search is found (array is empty) we just return!
            return;
        }

        markers.forEach(function (marker) {                         // Clear out the old markers from map, from earlier searches.
            marker.setMap(null);
        });
        markers = [];                                               // Reset the Array to empty


        var bounds = new google.maps.LatLngBounds();                // For each place, get the icon, name and location.
        places.forEach(function (place) {                           // Check if place has a geometry attribute, meaning it has data to give a                                                               position on the map!
            if (!place.geometry) {                                  // Return if no data!
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({       // push a marker to the map if it has a geometry attribute associated with it (to the                                               array we created before)
                map: map,                               // Constructor takes some attributes
                icon: icon,
                title: place.name,                      // "place" from the forEach function above!
                position: place.geometry.location,
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);              // pass in the bounds from the if function above
    });
}
