function Numero() {
    return new Promise(resolve => {
        setTimeout(() => resolve(5), 1000);
    });
}

function multiplicar(num) {
    return new Promise(resolve => {
        setTimeout(() => resolve(num * 2), 1000);
    });
}

function mostrar(num) {
    return new Promise(resolve => {
        setTimeout(() => resolve("Resultado: " + num), 1000);
    });
}

Numero()
    .then(resultado => multiplicar(resultado))
    .then(resultado => mostrar(resultado))
    .then(resultadoFinal => console.log(resultadoFinal))
    .catch(error => console.log(error));