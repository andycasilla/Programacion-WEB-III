function leerDatos(callback) {
    setTimeout(() => {
        callback(null, "Datos leídos");
    }, 1000);
}

function leerDatosPromesa() {
    return new Promise(resolve=>{
        leerDatos(resolve)
    })
}

leerDatosPromesa()
    .then(resultado => console.log(resultado))
