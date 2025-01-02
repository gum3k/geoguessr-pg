let panorama;
let streetViewService;
const STREETVIEW_MAX_DISTANCE = 100;

function initMap() {
    streetViewService = new google.maps.StreetViewService();
    findValidStreetView();
}

function getRandomCoordinates() {
    const lat = Math.random() * 180 - 90; 
    const lng = Math.random() * 360 - 180; 
    return { lat, lng };
}

function findValidStreetView() {
    const coords = getRandomCoordinates();

    streetViewService.getPanorama({
        location: coords,
        radius: STREETVIEW_MAX_DISTANCE
    }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById('street-view'), {
                position: data.location.latLng,
                pov: {
                    heading: 34,
                    pitch: 10
                },
                visible: true,
                addressControl: false
            });

        } else {
            findValidStreetView();
        }
    });
}

function reloadRandomLocation() {
    findValidStreetView();
}

document.getElementById('random-location').addEventListener('click', reloadRandomLocation);

