var request;
var service;
var markers = [];
var map;
var infoWindow;

function initMap() {
    var center = new google.maps.LatLng(40.712776, -74.005974);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15,
        disableDefaultUI: true

    });

    request = {
        location: center,
        radius: 1000,
        types: ['restaurant', 'cafe', 'bar']
    };
    //console.log(request)

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    google.maps.event.addListener(map, 'rightclick', function (event) {
        map.setCenter(event.latLng)
        clearResults(markers)

        var request = {
            location: event.latLng,
            radius: 1000,
            types: ['restaurant', 'cafe', 'bar']
        };
        service.nearbySearch(request, callback);
    })
}


function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));

            //! new code from today
            console.log(results)
            var place = results[i];
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

            bindInfoWindow(marker, map, infoWindow, content);
        }
    }
}

//!New code from today
function createPrice(level) {
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

//!New code from today
function bindInfoWindow(marker, map, infoWindow, html) {
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
}

function createMarker(place) {
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

function clearResults(markers) {
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = []
}
