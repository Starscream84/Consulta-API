const url = 'https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1'
const objects = [] //Arreglo global que guarda los objetos cargados, para accederlos por indice

// Cuando la pagina termina de cargar, oculta el popUp y carga la tabla
window.onload = function() {
    getObjects()
}
// Promises //

// Realiza un GET a la API y devuelve todos los objetos
/* Load Object */
function loadObjects() {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error(response.statusText)
        }
    })
    
}

// FUNCTIONS CONSUME THE PROMISES

/* Carga todos los objectos de la API y los muestra en la tabla */
function getObjects() {
    loadObjects()
        .then(response => {
            console.log(response)
            var tbody = document.querySelector('#tbody')
            tbody.innerHTML = '' // Limpia la tabla antes de recargar
            objects.length = 0 // Limpia el array global para evitar duplicados

            var data = Array.isArray(response) ? response : (response.data || [])
            console.log(data[0])

            data.forEach(function (object) {
                objects.push(object)
                insertTr(object, objects.length - 1)
            })

            showAgeMedia(data)
        })
        .catch(function (reason) {
            console.error(reason)
            document.querySelector('#tbody').innerHTML =
                '<tr><td colspan="9">Error al cargar los datos.</td></tr>'
        })
}

function showAgeMedia(data) {
    var sum = data.reduce(function (acc, object) {
        return acc + (object.Edad ?? 0)
    }, 0)
    var media = Math.round(sum / data.length)

    document.querySelector('tfoot').innerHTML = `
        <tr>
            <td colspan="9">Media de edad: ${media} años</td>
        </tr>
    `
}

function insertTr(object, index) {
    var tbody = document.querySelector('#tbody')
    var tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${object.nombre}</td>
        <td>${object.apellido}</td>
        <td>${object.Edad}</td>
        <td>${object.id_curso}</td>
        <td>${object.curso}</td>
        <td>${object.id_nivel}</td>
        <td>${object.nivel}</td>
    `
    tbody.appendChild(tr)
}




