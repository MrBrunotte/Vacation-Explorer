$(document).ready(function () {
    // type_holder
    // <div><label><input type="checkbox" class="types" value="mosque" />Mosque</label></div>

    //Create variable for the search hotel, restaurant and bar from the checkboxes in HTML file
    var types = ['hotel', 'restaurant', 'bar'];
    var html = '';

    $.each(types, function (index, value) {
        var name = value.replace(/_/g, " ");
        html += '<div><label><input type="checkbox" class="types" value="' + value + '" />' + capitalizeFirstLetter(name) + '</label></div>';
    });

    $('#type_holder').html(html);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// create variables
var map;
var infowindow;
var autocomplete;
var countryRestrict = { 'country': 'in' };
var selectedTypes = [];

function initialize() {
    // atutocomplete the searches in the searchbox with googles "Autocomplete function"
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('search')), {
        types: ['(regions)'],
        // componentRestrictions: countryRestrict
    });

    // Starting positoin for map "Middle of the Atlantic" initialze variable "pyrmont"
    var pyrmont = new google.maps.LatLng(36.198705, -23.446748);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 3
    });
}

// renderMap function
function renderMap() {
    // Get the user defined values (city)
    var address = document.getElementById('search').value;

    // get the selected type
    selectedTypes = [];
    $('.types').each(function () {
        if ($(this).is(':checked')) {
            selectedTypes.push($(this).val());
        }
    });

    var geocoder = new google.maps.Geocoder();
    var selLocLat = 0;
    var selLocLng = 0;

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            //console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

            selLocLat = results[0].geometry.location.lat();
            selLocLng = results[0].geometry.location.lng();

            //var pyrmont = new google.maps.LatLng(52.5666644, 4.7333304);

            var pyrmont = new google.maps.LatLng(selLocLat, selLocLng);

            // Zooms down to 14 to see the 
            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 14
            });

            //console.log(selectedTypes);

            var request = {
                location: pyrmont,
                radius: 5000,
                //types: ["atm"]
                radius: radius,
                types: selectedTypes
            };

            infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], results[i].icon);
        }
    }
}

function createMarker(place, icon) {
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: icon,
            scaledSize: new google.maps.Size(20, 20) // pixels
        },
        // drops the marker on the map
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name + '<br>' + place.vicinity);
        infowindow.open(map, this);
    });
}
