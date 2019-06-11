$(document).ready(function () {
    // type_holder
    // <div><label><input type="checkbox" class="types" value="bar" />bar</label></div>

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

function initialize() {
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), {
        types: ['(regions)'],
    });

    var pyrmont = new google.maps.LatLng(35.7465, -39.4629); //North Atlantic Ocean

    map = new google.maps.Map(document.getElementById('map'),
        {
            center: pyrmont,
            zoom: 3
        });
}

function renderMap() {
    var map;
    var infowindow;
    var autocomplete;
    var countryRestrict = { 'country': 'in' };
    var selectedTypes = [];
    // Get the user defined values
    var address = document.getElementById('city').value;

    var radius = 20000;

    // get the selected type
    selectedTypes = [];
    $('.types').each(function () {
        if ($(this).is(':checked')) {
            selectedTypes.push($(this).val());
        }
    });

    //console.log(selectedTypes);

    var geocoder = new google.maps.Geocoder();
    var selLocLat = 0;
    var selLocLng = 0;

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {

            selLocLat = results[0].geometry.location.lat();
            selLocLng = results[0].geometry.location.lng();

            var pyrmont = new google.maps.LatLng(selLocLat, selLocLng);

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 14
            });

            var request = {
                location: pyrmont,
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

    console.log(status, 'testing', results);

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i], results[i].icon);
        }
    }
}

function createMarker(place, icon) {
    var placeLoc = place.geometry.location;

    // Need to make a loop here to go throuhg the locations and pick the right icon!
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        type: ['restaurant'],
        icon: 'http://maps.google.com/mapfiles/kml/pal2/icon55.png', //fork and knive in a circle
        animation: google.maps.Animation.DROP
    });
    /*this is for the hotels and bars!
    
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            type: ['hotel'],
            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon20.png', //fork and knive in a circle
            animation: google.maps.Animation.DROP
        });
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            type: ['bar'],
            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon19.png', //fork and knive in a circle
            animation: google.maps.Animation.DROP
        });
        */

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name + '<br>' + place.vicinity);
        infowindow.open(map, this);
    });
}
