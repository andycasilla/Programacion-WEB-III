function miPromesa() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Operación exitosa");
        }, 1000);
    });
}

function miFuncion(callback) {
    miPromesa()
        .then(resultado => callback(null, resultado))
        .catch(error => callback(error, null));
}

// Uso
miFuncion((err, res) => {
    if (err) {
        console.log("Error:", err);
    } else {
        console.log(res);
    }
});