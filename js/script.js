var request;
var service;
var markers = [];
var map;
var infoWindow;

function initMap() {                                                //function to set the map
    var center = new google.maps.LatLng(40.712776, -74.005974);     //the starting location
    map = new google.maps.Map(document.getElementById('map'), {     //Get the #map from index.htmlö
        center: center,
        zoom: 15,
        disableDefaultUI: true                                      //Disable the UI from the map so it looks good on smaller screens
    });

    request = {                                                     //request to look for 'restaurants, cafes and bars' within 1000m radius
        location: center,
        radius: 1000,
        types: ['restaurant', 'cafe', 'bar']
    };
    //console.log(request)

    infoWindow = new google.maps.InfoWindow();                      //create the infowindow object from InfoWindow function
    service = new google.maps.places.PlacesService(map);            //create the service object from the PlacesService function
    service.nearbySearch(request, callback);

    google.maps.event.addListener(map, 'rightclick', function (event) {     //add listener for 'right-clicks' on the map
        map.setCenter(event.latLng)
        clearResults(markers)                                       //clear 'old' markers from map after 'right-click'
        console.log(markers)
        var request = {                                             //new search request after 'right-click'
            location: event.latLng,
            radius: 1000,
            types: ['restaurant', 'cafe', 'bar']
        };
        service.nearbySearch(request, callback);
    })
}


function callback(results, status) {                                //callback function that checks if everything is ok and
    if (status == google.maps.places.PlacesServiceStatus.OK) {      //creates all the markers for all the search findings
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));
            //console.log(results)
            var place = results[i];                                 //creates variables for text in infowindow
            let price = createPrice(place.price_level);
            let content =
                `<h4>${place.name}<h4>
             <h5>${place.vicinity}<h5>
             <p>Price: ${price}<br>
             Rating: ${place.rating}`;
            var marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
            });

            infoWindow = new google.maps.InfoWindow({
                content: content
            });
            //console.log(infoWindow)

            bindInfoWindow(marker, map, infoWindow, content);       //binds it all together in the infowindow
        }
    }
}

function createPrice(level) {                                       // createPrice function to get the $-signs (pricelevel)
    if (level != "" && level != null) {
        let out = "";
        for (var x = 0; x < level; x++) {
            out += "$";
        }
        return out;
    } else {
        return "?";
    }
}

function bindInfoWindow(marker, map, infoWindow, html) {            //function to bind text together in infowindow
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
}

function createMarker(place) {                                      //function to create markers
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function () {

        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
    });
    return marker;
}

function clearResults(markers) {                                    //!function to clear out "old" markers (not working properly!)
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = [];
}
