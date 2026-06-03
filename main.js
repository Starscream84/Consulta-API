const url = 'https://apidemo.geoeducacion.com.ar/api/testing/encuesta/1'
const objects = [] //Arreglo global que guarda los objetos cargados, para accederlos por indice

window.onload = function() {
    getObjects()
}
// Promises //

// Realiza un GET a la API y devuelve todos los objetos
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
            var tbody = document.querySelector('#tbody')
            tbody.innerHTML = '' 
            objects.length = 0 

            var data = Array.isArray(response) ? response : (response.data || [])

            data.forEach(function (object) {
                objects.push(object)
                insertTr(object, objects.length - 1)
            })
            showFrecuenciaNivel(data)
            showFrecuenciaCurso(data)
            showEstadisticos(data)
        })
        .catch(function (reason) {
            console.error(reason)
            document.querySelector('#tbody').innerHTML =
                '<tr><td colspan="6">Error al cargar los datos.</td></tr>'
        })
}

function insertTr(object, index) {
    var tbody = document.querySelector('#tbody')
    var tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${object.nombre}</td>
        <td>${object.apellido}</td>
        <td>${object.Edad}</td>
        <td>${object.curso}</td>
        <td>${object.nivel}</td>
    `
    tbody.appendChild(tr)
}

function showFrecuenciaNivel(data) {
    const frecuencias = {}

    data.forEach(obj => {

        var nivel = obj.nivel
        frecuencias[nivel] = (frecuencias[nivel] || 0) + 1 
    })

    var tbody = document.querySelector('#tbodyFrecuenciaNivel')
    tbody.innerHTML = ''
    var acumulada = 0

    for (let nivel in frecuencias) {
        acumulada += frecuencias[nivel]
        var relativa = ((frecuencias[nivel] / data.length) * 100).toFixed(2)

        tbody.innerHTML += `
            <tr>
                <td>${nivel}</td>
                <td>${frecuencias[nivel]}</td>
                <td>${acumulada}</td>
                <td>${relativa}%</td>
            </tr>
        `
    }
}

//frecuencia 
function showFrecuenciaCurso(data) {
    const secundario = data.filter(obj => obj.nivel === 'Secundario')
    const frecuencias = {}

    secundario.forEach(obj => {
        var curso = obj.curso
        frecuencias[curso] = (frecuencias[curso] || 0) + 1
    })

    var tbody = document.querySelector('#tbodyFrecuenciaCurso')

    tbody.innerHTML = ''

    var acumulada = 0

    for (var curso in frecuencias) {

        acumulada += frecuencias[curso]

        var relativa = ((frecuencias[curso] / secundario.length) * 100).toFixed(2)

        tbody.innerHTML += `
            <tr>
                <td>${curso}</td>
                <td>${frecuencias[curso]}</td>
                <td>${acumulada}</td>
                <td>${relativa}%</td>
            </tr>
        `
    }
}

// Calcula el cuatril 
function calcularCuatril(edadesOrdenadas, p) {
    const n = edadesOrdenadas.length
    if (n === 0) return 0

    const posicion = p * (n - 1)
    const indiceInferior = Math.floor(posicion)
    const indiceSuperior = Math.ceil(posicion)

    if (indiceInferior === indiceSuperior) {
        return edadesOrdenadas[indiceInferior]
    }

    const fraccion = posicion - indiceInferior
    const valorInferior = edadesOrdenadas[indiceInferior]
    const valorSuperior = edadesOrdenadas[indiceSuperior]
    return valorInferior + fraccion * (valorSuperior - valorInferior)
}

function showEstadisticos(data) {

    var edades = data.map(obj => Number(obj.Edad)).filter(e => !isNaN(e)).sort((a, b) => a - b)
    const n = edades.length

    // MEDIA
    var suma = 0
    for (var i = 0; i < n; i++) {
        suma += edades[i]
    }
    var mediaNum = suma / n
    var media = mediaNum.toFixed(2)

    // MEDIANA
    var mediana
    var mitad = Math.floor(n / 2)

    if (n % 2 === 0) {
        mediana = ((edades[mitad - 1] + edades[mitad]) / 2).toFixed(2)
    } else {
        mediana = edades[mitad].toFixed(2)
    }

    // MAXIMO / MINIMO
    var maximo = edades[n - 1]
    var minimo = edades[0]
    
    // CUARTILES
    var q1 = calcularCuatril(edades, 0.25).toFixed(2)

    var q2 = calcularCuatril(edades, 0.50).toFixed(2)

    // DESVIO ESTANDAR
    var sumaCuadrados = 0
    for (var i = 0; i < n; i++) {
        sumaCuadrados += (edades[i] - mediaNum) ** 2
    }
    var varianza = sumaCuadrados / n
    var desvio = Math.sqrt(varianza).toFixed(2)

    var tbody = document.querySelector('#tbodyEstadisticos')

    tbody.innerHTML = `
        <tr>
            <td>Media</td>
            <td>${media}</td>
        </tr>

        <tr>
            <td>Mediana</td>
            <td>${mediana}</td>
        </tr>

        <tr>
            <td>Máximo</td>
            <td>${maximo}</td>
        </tr>

        <tr>
            <td>Mínimo</td>
            <td>${minimo}</td>
        </tr>

        <tr>
            <td>Primer Cuartil</td>
            <td>${q1}</td>
        </tr>

        <tr>
            <td>Segundo Cuartil</td>
            <td>${q2}</td>
        </tr>

        <tr>
            <td>Desvío estándar</td>
            <td>${desvio}</td>
        </tr>
    `
}



