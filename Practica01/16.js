function obtenerDatos() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Datos obtenidos"), 1000);
    });
}

obtenerDatos()
    .then(res => console.log("Promesas:", res))
    .catch(err => console.log(err));

async function main() {
    try {
        let res = await obtenerDatos();
        console.log("Async/Await:", res);
    } catch (err) {
        console.log(err);
    }
}

main();