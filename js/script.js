var map;


// valores posibles Longitud -180 < x < 180 ; Latitud -90 < y < 90 ]
const validateLatAndLong = (lat, lng) => {
    return (lat > -180 && lat < 180 && lng > -90 && lng < 90) ? true : false;
}

const validateString = (name, address, phone) => {
    return (name.length > 3, address.length > 3, phone.length > 3) ? true : false;
}

const addMarkerWithClick = position => {
    let marker = new google.maps.Marker({
        position,
        map
    });
}

const addMarker = e => {
    e.preventDefault();
    let name = document.querySelector('#name').value,
        address = document.querySelector('#address').value,
        phone = document.querySelector('#phone').value,
        category = document.querySelector('#category').value,
        coords = (document.querySelector('#coords').value).split(',');

    let lat = +coords[0],
        lng = +coords[1];

    if(validateLatAndLong(lat, lng) && validateString(name, address, phone)){
        let marker = new google.maps.Marker({
            position: {
                lat, lng
            },
            map
        });
        M.toast({html: 'Marcador agregado'});
        btnSearch.className = 'modal-close';
    }
    else
        M.toast({html: 'Verificar datos del formulario'});
}

function initMap() {
    let position = { 
        lat: -34.595986, 
        lng: -58.3724715
    }
    
    let options = {
        center: position,
        zoom: 15
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    map.addListener('click', evt => addMarkerWithClick(evt.latLng));

    let marker = new google.maps.Marker({
        position,
        map
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let modal = document.querySelectorAll('.modal'),
        select = document.querySelectorAll('select');
    
    let initModal = M.Modal.init(modal);
        initSelect = M.FormSelect.init(select);
        instanceModal = M.Modal.getInstance(initModal);

    let btnSearch = document.querySelector('#btnSearch');
    btnSearch.addEventListener('click', addMarker);

});



