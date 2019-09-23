var map;
let db = new PouchDB('markers');


// valores posibles Longitud -180 < x < 180 ; Latitud -90 < y < 90 ]
const validateLatAndLong = (lat, lng) => {
    return (lat > -180 && lat < 180 && lng > -90 && lng < 90) ? true : false;
}

const validateString = (name, address) => {
    return (name.length > 3, address.length > 3) ? true : false;
}

// Agrega marcador con un click
const addMarkerWithClick = position => {
    let marker = new google.maps.Marker({
        position,
        map,
        title: ''
    });

    marker.addListener("dblclick", evt => {
        marker.setMap(null);
        removeMarker(evt);
    });

    saveOnDatabase(marker);
}

// Eliminar marcador con doble click
const removeMarker = evt => {
    db.allDocs({include_docs: true, descending: false})
        .then(docs => {
            docs.rows.forEach(row => {
                let doc = row.doc;
                if(doc.lat == evt.latLng.lat() && doc.lng == evt.latLng.lng()){
                    db.remove(doc);
                    M.toast({html: 'Marcador eliminado'})
                }
            });
        })
}

// Agregar marcador desde formulario
const addMarker = e => {
    e.preventDefault();
    let name = document.querySelector('#name').value,
        address = document.querySelector('#address').value,
        phone = document.querySelector('#phone').value,
        category = document.querySelector('#category').value,
        coords = (document.querySelector('#coords').value).split(',');

    let lat = +coords[0],
        lng = +coords[1];

    let info = `<p><strong>Descripci&oacuten:</strong> ${name}</p>
                <p><strong>Direcci&oacuten:</strong> ${address}</p>
                <p><strong>Tel&eacutefono:</strong> ${phone}</p>
                <p><strong>(X , Y):</strong> ${lat}, ${lng}</p>
                <p><strong>Categor&iacutea:</strong> ${category}</p>`;

    if(validateLatAndLong(lat, lng) && validateString(name, address)){
        let infowindow = new google.maps.InfoWindow({
            content: info
        });

        let marker = new google.maps.Marker({
            position: {
                lat, lng
            },
            map,
            title: info
        });

        marker.addListener("dblclick", evt => {
            marker.setMap(null);
            removeMarker(evt);
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

        saveOnDatabase(marker);

        btnSearch.className = 'modal-close';
    }
    else
        M.toast({html: 'Verificar datos del formulario'});
}

// Iniciar mapa
function initMap() {
    navigator.geolocation.getCurrentPosition(location => {
        let position = { 
            lat: location.coords.latitude, 
            lng: location.coords.longitude
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
    
        marker.addListener("dblclick", evt => {
            marker.setMap(null);
            removeMarker(evt);
        });
    
        readDatabase();
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

// Guardar marcadores en base de datos local
const saveOnDatabase = marker => {
    let markerToSave = {
        _id: new Date().toISOString(),
        lat: marker.position.lat(),
        lng: marker.position.lng(),
        info: marker.title
    }
    db.put(markerToSave)
        .then(M.toast({html: 'Marcador agregado'}))
}

const readDatabase = () => {
    db.allDocs({include_docs: true, descending: false})
        .then(docs => addMarkersToList(docs.rows))
}

const addMarkersToList = list => {
    list.forEach(element => {
        let infowindow = new google.maps.InfoWindow({
            content: element.doc.info
        });

        let marker = new google.maps.Marker({
            position: {
                lat: element.doc.lat,
                lng: element.doc.lng
            },
            map,
            title: element.doc.title
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

        marker.addListener("dblclick", evt => {
            marker.setMap(null);
            removeMarker(evt);
        });
    });
}

