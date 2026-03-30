function miFuncion(cad) {
    let n = cad.length;

    for (let i = 0; i < n / 2; i++) {
        if (cad[i] !== cad[n - 1 - i]) {
            return false;
        }
    }

    return true;
}

let band = miFuncion("oruro");
console.log(band);

band = miFuncion("hola");
console.log(band);